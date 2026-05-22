package com.ezone.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Integer> {
    Optional<Submission> findByAssignmentIdAndStudentId(Integer assignmentId, Integer studentId);
    List<Submission> findByAssignmentId(Integer assignmentId);
    boolean existsByAssignmentIdAndStudentId(Integer assignmentId, Integer studentId);
}
