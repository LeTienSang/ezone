package com.ezone.user;

import com.ezone.common.dto.PageResponse;
import com.ezone.common.exception.BadRequestException;
import com.ezone.common.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public User getMe(String username) {
        log.info("Fetching profile details for user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + username));
        return user;
    }

    @Transactional
    public User updateMe(String username, UpdateProfileRequest req) {
        log.info("Updating profile details for user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + username));

        if (req.getFullName() != null) {
            user.setFullName(req.getFullName());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone());
        }
        if (req.getAvatar() != null) {
            user.setAvatar(req.getAvatar());
        }

        User saved = userRepository.save(user);
        log.info("Profile details updated successfully for user: {}", username);
        return saved;
    }

    @Transactional(readOnly = true)
    public PageResponse<User> getAllUsers(String role, int page, int size) {
        log.info("Fetching users with role: {}, page: {}, size: {}", role, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<User> userPage;

        if (role != null && !role.trim().isEmpty()) {
            try {
                User.Role roleEnum = User.Role.valueOf(role.trim().toUpperCase());
                userPage = userRepository.findByRole(roleEnum, pageable);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid role provided: {}", role);
                throw new BadRequestException("Vai trò không hợp lệ: " + role);
            }
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return PageResponse.fromPage(userPage);
    }

    @Transactional
    public User toggleActive(Integer targetId, String currentUsername) {
        log.info("User {} is attempting to toggle active status for user ID: {}", currentUsername, targetId);
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng hiện tại"));

        if (currentUser.getId().equals(targetId)) {
            log.warn("User {} tried to lock their own account", currentUsername);
            throw new BadRequestException("Không thể khóa tài khoản đang đăng nhập");
        }

        User targetUser = userRepository.findById(targetId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + targetId));

        targetUser.setIsActive(!targetUser.getIsActive());
        User saved = userRepository.save(targetUser);

        log.info("User ID {} active status toggled to {}", targetId, saved.getIsActive());
        return saved;
    }
}
