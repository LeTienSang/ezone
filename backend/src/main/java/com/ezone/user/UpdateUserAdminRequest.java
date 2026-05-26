package com.ezone.user;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserAdminRequest {
    private String password;

    @Email(message = "Email không hợp lệ")
    private String email;

    private String fullName;

    private String phone;

    private String role;

    private Boolean isActive;
}
