package com.ezone.auth;

import com.ezone.common.exception.BadRequestException;
import com.ezone.common.util.JwtUtil;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${google.client-id}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        log.info("Logging in user with email: {}", req.getEmail());
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found for email {}", req.getEmail());
                    return new BadRequestException("Tài khoản hoặc mật khẩu không chính xác");
                });

        if (!user.getIsActive()) {
            log.warn("Login failed: Account is locked for email {}", req.getEmail());
            throw new BadRequestException("Tài khoản của bạn đã bị khóa");
        }

        if (user.getPassword() == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            log.warn("Login failed: Password mismatch for email {}", req.getEmail());
            throw new BadRequestException("Tài khoản hoặc mật khẩu không chính xác");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        log.info("User {} logged in successfully with role {}", user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getRole().name());
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest req) {
        log.info("Processing Google login");

        // Verify the Google ID token
        GoogleIdToken.Payload payload;
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(req.getIdToken());
            if (idToken == null) {
                log.warn("Google login failed: Invalid ID token");
                throw new BadRequestException("Google token không hợp lệ");
            }
            payload = idToken.getPayload();
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Google login failed: Error verifying token", e);
            throw new BadRequestException("Không thể xác thực với Google. Vui lòng thử lại.");
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String picture = (String) payload.get("picture");

        if (email == null || email.isBlank()) {
            throw new BadRequestException("Không thể lấy email từ tài khoản Google");
        }

        log.info("Google login: verified email={}, name={}", email, name);

        // Find or create user
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Create new user from Google account
            user = new User();
            user.setEmail(email);
            user.setFullName(name != null ? name : email.split("@")[0]);
            user.setUsername(generateUsernameFromEmail(email));
            user.setAvatar(picture);
            user.setRole(User.Role.STUDENT);
            user.setIsActive(true);
            // password is null - Google users don't need a password
            user = userRepository.save(user);
            log.info("Created new user from Google login: {}", user.getUsername());
        } else {
            // Existing user
            if (!user.getIsActive()) {
                log.warn("Google login failed: Account is locked for email {}", email);
                throw new BadRequestException("Tài khoản của bạn đã bị khóa");
            }
            if (user.getRole() == User.Role.GUEST) {
                // Upgrade GUEST → STUDENT
                user.setFullName(name != null ? name : user.getFullName());
                user.setRole(User.Role.STUDENT);
                if (picture != null && user.getAvatar() == null) {
                    user.setAvatar(picture);
                }
                user = userRepository.save(user);
                log.info("Upgraded GUEST user {} to STUDENT via Google login", user.getUsername());
            } else {
                // Update avatar if not set
                if (picture != null && user.getAvatar() == null) {
                    user.setAvatar(picture);
                    user = userRepository.save(user);
                }
                log.info("Existing user {} logged in via Google", user.getUsername());
            }
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getRole().name());
    }

    @Transactional
    public User register(RegisterRequest req) {
        log.info("Registering new student with email: {}", req.getEmail());
        java.util.Optional<User> existingOpt = userRepository.findByEmail(req.getEmail());
        if (existingOpt.isPresent()) {
            User existing = existingOpt.get();
            if (existing.getRole() == User.Role.GUEST) {
                // Upgrade GUEST → STUDENT: user previously submitted consultation, now registering
                log.info("Upgrading GUEST user {} to STUDENT", existing.getUsername());
                existing.setFullName(req.getFullName());
                existing.setPhone(req.getPhone());
                existing.setPassword(passwordEncoder.encode(req.getPassword()));
                existing.setRole(User.Role.STUDENT);
                User saved = userRepository.save(existing);
                log.info("GUEST user upgraded to STUDENT successfully: {}", saved.getUsername());
                return saved;
            }
            log.warn("Registration failed: Email {} already exists with role {}", req.getEmail(), existing.getRole());
            throw new BadRequestException("Email này đã tồn tại trên hệ thống");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setUsername(generateUsernameFromEmail(req.getEmail()));
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.STUDENT);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        log.info("Registered user successfully: {}", savedUser.getUsername());
        return savedUser;
    }

    private String generateUsernameFromEmail(String email) {
        String base = email.split("@")[0];
        if (base.length() > 40) {
            base = base.substring(0, 40);
        }
        String username = base;
        int count = 1;
        while (userRepository.findByUsername(username).isPresent()) {
            username = base + count;
            count++;
        }
        return username;
    }
}
