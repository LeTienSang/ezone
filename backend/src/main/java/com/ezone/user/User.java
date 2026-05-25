package com.ezone.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "USERS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;
    private String email;
    private String fullName;
    private String phone;
    @Convert(converter = com.ezone.common.util.RoleConverter.class)
    private Role role;
    private String avatar;
    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        ADMIN, TEACHER, STUDENT, GUEST
    }
}