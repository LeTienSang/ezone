package com.ezone.classroom;

import com.ezone.common.dto.ApiResponse;
import com.ezone.common.dto.PageResponse;
import com.ezone.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Slf4j
@Tag(name = "Classroom Management", description = "Endpoints for administering classrooms and sessions")
@RestController
@RequestMapping("/api/v1/classes")
public class ClassroomController {
    private final ClassroomService classroomService;

    public ClassroomController(ClassroomService classroomService) {
        this.classroomService = classroomService;
    }

    @Operation(summary = "Get paginated list of all classes (Admin only)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<ClassEntity>>> getAllClasses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("REST request to get all classes, page: {}, size: {}", page, size);
        PageResponse<ClassEntity> classes = classroomService.getAllClasses(page, size);
        return ResponseEntity.ok(ApiResponse.success(classes));
    }

    @Operation(summary = "Create a new classroom (Admin only)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClassEntity>> createClass(@Valid @RequestBody CreateClassRequest req) {
        log.info("REST request to create class: {}", req.getClassName());
        ClassEntity saved = classroomService.createClass(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Tạo lớp học mới thành công"));
    }

    @Operation(summary = "Get classrooms of the current student/teacher")
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<ClassEntity>>> getMyClasses() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get classes for user: {}", username);
        List<ClassEntity> classes = classroomService.getMyClasses(username);
        return ResponseEntity.ok(ApiResponse.success(classes));
    }

    @Operation(summary = "Get all sessions of a classroom")
    @GetMapping("/{classId}/sessions")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<ClassSession>>> getClassSessions(@PathVariable("classId") Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get sessions of class ID {} for user: {}", classId, username);
        List<ClassSession> sessions = classroomService.getClassSessions(classId, username);
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }

    @Operation(summary = "Update a session's details (Teacher only)")
    @PutMapping("/{classId}/sessions/{sessionId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<ClassSession>> updateSession(
            @PathVariable("classId") Integer classId,
            @PathVariable("sessionId") Integer sessionId,
            @Valid @RequestBody UpdateSessionRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to update session ID {} of class ID {} by user {}", sessionId, classId, username);
        ClassSession saved = classroomService.updateSession(classId, sessionId, username, req);
        return ResponseEntity.ok(ApiResponse.success(saved, "Cập nhật buổi học thành công"));
    }

    @Operation(summary = "Get list of all members in a classroom (Teacher/Admin only)")
    @GetMapping("/{classId}/members")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Set<User>>> getClassMembers(@PathVariable("classId") Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get members of class ID {} by user {}", classId, username);
        Set<User> students = classroomService.getClassMembers(classId, username);
        return ResponseEntity.ok(ApiResponse.success(students));
    }

    @Operation(summary = "Get timetable of the current student/teacher")
    @GetMapping("/timetable")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<ClassSession>>> getMyTimetable() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get timetable for user: {}", username);
        List<ClassSession> sessions = classroomService.getMyTimetable(username);
        return ResponseEntity.ok(ApiResponse.success(sessions));
    }
}