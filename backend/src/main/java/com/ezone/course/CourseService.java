package com.ezone.course;

import com.ezone.common.dto.PageResponse;
import com.ezone.common.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class CourseService {
    private final CourseCatalogRepository courseRepository;

    public CourseService(CourseCatalogRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<CourseCatalog> getAllCourses(int page, int size) {
        log.info("Fetching active courses, page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<CourseCatalog> courses = courseRepository.findAllByIsVisibleTrue(pageable);
        return PageResponse.fromPage(courses);
    }

    @Transactional(readOnly = true)
    public CourseCatalog getCourseById(Integer id) {
        log.info("Fetching course details for ID: {}", id);
        return courseRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Course details lookup failed: Course not found with ID {}", id);
                    return new ResourceNotFoundException("Khóa học không tồn tại");
                });
    }
}
