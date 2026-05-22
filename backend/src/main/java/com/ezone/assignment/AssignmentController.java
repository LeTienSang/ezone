package com.ezone.assignment;

import com.ezone.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Tag(name = "Assignment Management", description = "Endpoints for student homework assignments and grading")
@RestController
@RequestMapping("/api/v1")
public class AssignmentController {
    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @Operation(summary = "Get list of all assignments in a classroom")
    @GetMapping("/classes/{classId}/assignments")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getClassAssignments(@PathVariable("classId") Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get assignments for class ID {} by user {}", classId, username);
        List<AssignmentResponse> responses = assignmentService.getClassAssignments(classId, username);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @Operation(summary = "Create a new classroom assignment (Teacher only)")
    @PostMapping("/classes/{classId}/assignments")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(
            @PathVariable("classId") Integer classId,
            @Valid @RequestBody CreateAssignmentRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to create assignment in class ID {} by instructor {}", classId, username);
        Assignment saved = assignmentService.createAssignment(classId, username, req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Giao bài tập mới thành công"));
    }

    @Operation(summary = "Submit a student solution for an assignment (Student only)")
    @PostMapping(value = "/assignments/{assignmentId}/submissions", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Submission>> submitAssignment(
            @PathVariable("assignmentId") Integer assignmentId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "content", required = false) String content) throws IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to submit solution for assignment ID {} by student {}", assignmentId, username);
        Submission saved = assignmentService.submitAssignment(assignmentId, username, file, content);
        return ResponseEntity.ok(ApiResponse.success(saved, "Nộp bài tập thành công"));
    }

    @Operation(summary = "Grade an assignment submission (Teacher only)")
    @PostMapping("/submissions/{submissionId}/score")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Score>> scoreSubmission(
            @PathVariable("submissionId") Integer submissionId,
            @Valid @RequestBody ScoreRequest req) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to grade submission ID {} by teacher {}", submissionId, username);
        Score saved = assignmentService.scoreSubmission(submissionId, username, req);
        return ResponseEntity.ok(ApiResponse.success(saved, "Chấm điểm thành công"));
    }

    @Operation(summary = "Get current student's own homework grades (Student only)")
    @GetMapping("/student/me/scores")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentScoreResponse>>> getMyScores() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get scores for student: {}", username);
        List<StudentScoreResponse> scores = assignmentService.getMyScores(username);
        return ResponseEntity.ok(ApiResponse.success(scores));
    }
}
