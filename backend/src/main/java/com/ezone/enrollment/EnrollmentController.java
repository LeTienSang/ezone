package com.ezone.enrollment;

import com.ezone.common.dto.ApiResponse;
import com.ezone.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Enrollment Management", description = "Endpoints for student course consultations and enrollment approvals")
@RestController
@RequestMapping("/api/v1/enrollments")
public class EnrollmentController {
    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @Operation(summary = "Request a course consultation or enrollment")
    @PostMapping
    public ResponseEntity<ApiResponse<Enrollment>> requestConsultation(@Valid @RequestBody EnrollmentRequest req) {
        log.info("REST request to request consultation for email: {}, course: {}", req.getEmail(), req.getCourseId());
        Enrollment saved = enrollmentService.requestConsultation(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved));
    }

    @Operation(summary = "Get paginated list of all enrollment requests (Admin only)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<Enrollment>>> getAllEnrollments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("REST request to get all enrollments with status: {}, page: {}, size: {}", status, page, size);
        PageResponse<Enrollment> enrollments = enrollmentService.getAllEnrollments(status, page, size);
        return ResponseEntity.ok(ApiResponse.success(enrollments));
    }

    @Operation(summary = "Approve an enrollment request and assign to class (Admin only)")
    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Enrollment>> approveEnrollment(
            @PathVariable("id") Integer id, 
            @Valid @RequestBody ApproveRequest req) {
        log.info("REST request to approve enrollment ID: {}, assigning to class ID: {}", id, req.getClassId());
        Enrollment saved = enrollmentService.approveEnrollment(id, req);
        return ResponseEntity.ok(ApiResponse.success(saved, "Phê duyệt đăng ký và xếp lớp thành công"));
    }

    @Operation(summary = "Reject an enrollment request (Admin only)")
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Enrollment>> rejectEnrollment(@PathVariable("id") Integer id) {
        log.info("REST request to reject enrollment ID: {}", id);
        Enrollment saved = enrollmentService.rejectEnrollment(id);
        return ResponseEntity.ok(ApiResponse.success(saved, "Đã từ chối đơn đăng ký tư vấn"));
    }
}