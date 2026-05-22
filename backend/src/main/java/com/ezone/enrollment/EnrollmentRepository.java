package com.ezone.enrollment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    Page<Enrollment> findByStatus(Enrollment.Status status, Pageable pageable);
}