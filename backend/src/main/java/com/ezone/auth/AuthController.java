package com.ezone.auth;

import com.ezone.common.dto.ApiResponse;
import com.ezone.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Login to get JWT token")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest req) {
        log.info("REST request to login user: {}", req.getEmail());
        AuthResponse res = authService.login(req);
        return ResponseEntity.ok(ApiResponse.success(res, "Đăng nhập thành công"));
    }

    @Operation(summary = "Login with Google OAuth2")
    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest req) {
        log.info("REST request to login with Google");
        AuthResponse res = authService.loginWithGoogle(req);
        return ResponseEntity.ok(ApiResponse.success(res, "Đăng nhập bằng Google thành công"));
    }

    @Operation(summary = "Register a new student account")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody RegisterRequest req) {
        log.info("REST request to register new user: {}", req.getEmail());
        User user = authService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(user, "Đăng ký tài khoản thành công"));
    }

    @Operation(summary = "Logout user session")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout() {
        log.info("REST request to logout user");
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công"));
    }
}