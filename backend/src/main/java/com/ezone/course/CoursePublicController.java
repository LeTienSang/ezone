package com.ezone.course;

import com.ezone.common.dto.ApiResponse;
import com.ezone.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Course Catalog", description = "Public endpoints for browsing the course catalog")
@RestController
@RequestMapping("/api/v1/courses")
public class CoursePublicController {
    private final CourseService courseService;

    public CoursePublicController(CourseService courseService) {
        this.courseService = courseService;
    }

    @Operation(summary = "Get paginated list of all courses")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CourseCatalog>>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("REST request to get all courses, page: {}, size: {}", page, size);
        PageResponse<CourseCatalog> courses = courseService.getAllCourses(page, size);
        return ResponseEntity.ok(ApiResponse.success(courses));
    }

    @Operation(summary = "Get course details by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseCatalog>> getCourseById(@PathVariable("id") Integer id) {
        log.info("REST request to get course details for ID: {}", id);
        CourseCatalog course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success(course));
    }
}