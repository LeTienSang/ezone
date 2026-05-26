package com.ezone.user;

import com.ezone.common.dto.ApiResponse;
import com.ezone.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "User Management", description = "Endpoints for retrieving and updating user accounts")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get current user's profile details")
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<User>> getMe() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get profile details for current user: {}", username);
        User user = userService.getMe(username);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @Operation(summary = "Update current user's profile details")
    @PatchMapping("/me")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateMe(@Valid @RequestBody UpdateProfileRequest profileDetails) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to update profile details for current user: {}", username);
        User saved = userService.updateMe(username, profileDetails);
        return ResponseEntity.ok(ApiResponse.success(saved, "Cập nhật hồ sơ thành công"));
    }

    @Operation(summary = "Change current user's password")
    @PatchMapping("/me/password")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to change password for current user: {}", username);
        userService.changePassword(username, req);
        return ResponseEntity.ok(ApiResponse.success(null, "Đổi mật khẩu thành công"));
    }

    @Operation(summary = "Upload current user's avatar")
    @PostMapping(value = "/me/avatar", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<User>> uploadAvatar(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws java.io.IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to upload avatar for user: {}", username);
        User saved = userService.uploadAvatar(username, file);
        return ResponseEntity.ok(ApiResponse.success(saved, "Tải ảnh đại diện thành công"));
    }

    @Operation(summary = "Get all users (Admin only)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<User>>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("REST request to get all users with role: {}, page: {}, size: {}", role, page, size);
        PageResponse<User> usersPage = userService.getAllUsers(role, page, size);
        return ResponseEntity.ok(ApiResponse.success(usersPage));
    }

    @Operation(summary = "Toggle user active state (Admin only)")
    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> toggleActive(@PathVariable("id") Integer id) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to toggle active status of user ID {} by admin {}", id, currentUsername);
        User saved = userService.toggleActive(id, currentUsername);
        String msg = saved.getIsActive() ? "Mở khóa tài khoản thành công" : "Khóa tài khoản thành công";
        return ResponseEntity.ok(ApiResponse.success(saved, msg));
    }

    @Operation(summary = "Create a new user (Admin only)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody CreateUserRequest req) {
        log.info("REST request to create user: {}", req.getUsername());
        User saved = userService.createUser(req);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(ApiResponse.success(saved, "Tạo người dùng thành công"));
    }

    @Operation(summary = "Update a user (Admin only)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateUser(@PathVariable("id") Integer id, @Valid @RequestBody UpdateUserAdminRequest req) {
        log.info("REST request to update user ID={}", id);
        User saved = userService.updateUserAdmin(id, req);
        return ResponseEntity.ok(ApiResponse.success(saved, "Cập nhật người dùng thành công"));
    }

    @Operation(summary = "Change user role (Admin only)")
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> changeRole(@PathVariable("id") Integer id, @Valid @RequestBody ChangeUserRoleRequest req) {
        log.info("REST request to change role for user ID={}", id);
        User saved = userService.changeUserRole(id, req);
        return ResponseEntity.ok(ApiResponse.success(saved, "Cập nhật vai trò thành công"));
    }
}