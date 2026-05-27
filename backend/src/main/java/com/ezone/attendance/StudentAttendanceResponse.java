package com.ezone.attendance;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class StudentAttendanceResponse {
    private String className;
    private String sessionTitle;
    private LocalDateTime sessionDate;
    private String status;
    private String note;

    public StudentAttendanceResponse(String className, String sessionTitle, LocalDateTime sessionDate, Attendance.Status status, String note) {
        this.className = className;
        this.sessionTitle = sessionTitle;
        this.sessionDate = sessionDate;
        this.status = status != null ? status.name() : null;
        this.note = note;
    }
}
