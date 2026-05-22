package com.ezone.attendance;

import com.ezone.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "Attendance Management", description = "Endpoints for tracking class attendance")
@RestController
@RequestMapping("/api/v1")
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @Operation(summary = "Get attendance list of a class session")
    @GetMapping("/classes/{classId}/sessions/{sessionId}/attendance")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Attendance>>> getSessionAttendance(
            @PathVariable("classId") Integer classId,
            @PathVariable("sessionId") Integer sessionId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get attendance for session ID {} of class ID {} by user {}", sessionId, classId, username);
        List<Attendance> list = attendanceService.getSessionAttendance(classId, sessionId, username);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @Operation(summary = "Record attendance for a class session")
    @PostMapping("/classes/{classId}/sessions/{sessionId}/attendance")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Void>> recordAttendance(
            @PathVariable("classId") Integer classId,
            @PathVariable("sessionId") Integer sessionId,
            @Valid @RequestBody TakeAttendanceRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to record attendance for session ID {} of class ID {} by instructor {}", sessionId, classId, username);
        attendanceService.recordAttendance(classId, sessionId, username, req);
        return ResponseEntity.ok(ApiResponse.success(null, "Ghi nhận điểm danh thành công"));
    }

    @Operation(summary = "Get current student's own attendance history")
    @GetMapping("/student/me/attendance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentAttendanceResponse>>> getMyAttendance() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get attendance history for student: {}", username);
        List<StudentAttendanceResponse> list = attendanceService.getMyAttendance(username);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
