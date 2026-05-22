package com.ezone.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Integer> {
    Optional<Score> findBySubmissionId(Integer submissionId);

    @Query("SELECT new com.ezone.assignment.StudentScoreResponse(s.submission.assignment.classEntity.className, s.submission.assignment.title, s.submission.assignment.maxScore, s.score, s.teacherFeedback, s.gradedAt) " +
           "FROM Score s WHERE s.submission.student.username = :username")
    List<StudentScoreResponse> findScoresForStudent(@Param("username") String username);
}
