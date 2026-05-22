package com.ezone.attendance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {
    @NotNull(message = "ID học viên không được để trống")
    private Integer studentId;

    @NotBlank(message = "Trạng thái điểm danh không được để trống")
    private String status; // present, absent, late

    private String note;
}
