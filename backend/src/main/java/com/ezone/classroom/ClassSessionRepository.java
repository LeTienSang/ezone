package com.ezone.classroom;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ClassSessionRepository extends JpaRepository<ClassSession, Integer> {
    @Query("SELECT s FROM ClassSession s JOIN s.classEntity.students student WHERE student.username = :username")
    List<ClassSession> findScheduleForStudent(@Param("username") String username);

    @Query("SELECT s FROM ClassSession s WHERE s.classEntity.instructor.user.username = :username")
    List<ClassSession> findScheduleForTeacher(@Param("username") String username);

    List<ClassSession> findByClassEntityId(Integer classId);
}