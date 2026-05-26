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

    @Transactional
    public CourseCatalog createCourse(CreateCourseRequest req) {
        log.info("Creating new course: {}", req.getCourseName());
        CourseCatalog c = new CourseCatalog();
        c.setCourseName(req.getCourseName());
        c.setDescription(req.getDescription());
        c.setPrice(req.getPrice());
        c.setDuration(req.getDuration());
        c.setLevel(req.getLevel());
        c.setThumbnail(req.getThumbnail());
        c.setIsVisible(req.getIsVisible() == null ? true : req.getIsVisible());
        CourseCatalog saved = courseRepository.save(c);
        log.info("Course created: ID={}, name={}", saved.getId(), saved.getCourseName());
        return saved;
    }

    @Transactional
    public CourseCatalog updateCourse(Integer id, UpdateCourseRequest req) {
        log.info("Updating course ID={}", id);
        CourseCatalog c = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));

        if (req.getCourseName() != null) c.setCourseName(req.getCourseName());
        if (req.getDescription() != null) c.setDescription(req.getDescription());
        if (req.getPrice() != null) c.setPrice(req.getPrice());
        if (req.getDuration() != null) c.setDuration(req.getDuration());
        if (req.getLevel() != null) c.setLevel(req.getLevel());
        if (req.getThumbnail() != null) c.setThumbnail(req.getThumbnail());
        if (req.getIsVisible() != null) c.setIsVisible(req.getIsVisible());

        CourseCatalog saved = courseRepository.save(c);
        log.info("Course updated: ID={}", saved.getId());
        return saved;
    }

    @Transactional
    public void deleteCourse(Integer id) {
        log.info("Deleting course ID={}", id);
        CourseCatalog c = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        courseRepository.delete(c);
        log.info("Course deleted ID={}", id);
    }
}
