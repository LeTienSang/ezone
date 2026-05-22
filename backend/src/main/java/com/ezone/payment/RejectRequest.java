package com.ezone.payment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RejectRequest {
    @NotBlank(message = "Lý do từ chối không được để trống")
    private String reason;
}
