package com.ezone.course;

import com.ezone.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Course Admin", description = "Admin endpoints for managing courses")
@RestController
@RequestMapping("/api/v1/admin/courses")
public class CourseAdminController {
    private final CourseService courseService;

    public CourseAdminController(CourseService courseService) {
        this.courseService = courseService;
    }

    @Operation(summary = "Create a new course (Admin only)")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CourseCatalog>> createCourse(@Valid @RequestBody CreateCourseRequest req) {
        CourseCatalog saved = courseService.createCourse(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(saved, "Tạo khóa học thành công"));
    }

    @Operation(summary = "Update a course (Admin only)")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CourseCatalog>> updateCourse(@PathVariable("id") Integer id,
                                                                    @Valid @RequestBody UpdateCourseRequest req) {
        CourseCatalog saved = courseService.updateCourse(id, req);
        return ResponseEntity.ok(ApiResponse.success(saved, "Cập nhật khóa học thành công"));
    }

    @Operation(summary = "Delete a course (Admin only)")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable("id") Integer id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa khóa học thành công"));
    }
}
