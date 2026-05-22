package com.ezone.attendance;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TakeAttendanceRequest {
    @NotEmpty(message = "Danh sách điểm danh không được để trống")
    @Valid
    private List<AttendanceRecord> records;
}
