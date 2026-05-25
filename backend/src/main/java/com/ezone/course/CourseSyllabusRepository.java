package com.ezone.course;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseSyllabusRepository extends JpaRepository<CourseSyllabus, Integer> {
    List<CourseSyllabus> findByCourseIdOrderBySortOrderAsc(Integer courseId);
}
