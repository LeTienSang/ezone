package com.ezone.user;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangeUserRoleRequest {
    @NotBlank(message = "Vai trò không được để trống")
    private String role;
}
