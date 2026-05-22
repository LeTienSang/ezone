package com.ezone.enrollment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApproveRequest {
    @NotNull(message = "ID lớp học không được để trống")
    private Integer classId;
}
