package com.ezone.auth;

import com.ezone.common.exception.BadRequestException;
import com.ezone.common.util.JwtUtil;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

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

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            log.warn("Login failed: Password mismatch for email {}", req.getEmail());
            throw new BadRequestException("Tài khoản hoặc mật khẩu không chính xác");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        log.info("User {} logged in successfully with role {}", user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getRole().name());
    }

    @Transactional
    public User register(RegisterRequest req) {
        log.info("Registering new student with email: {}", req.getEmail());
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            log.warn("Registration failed: Email {} already exists", req.getEmail());
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
