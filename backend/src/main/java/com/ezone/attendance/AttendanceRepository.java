package com.ezone.attendance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    Optional<Attendance> findBySessionIdAndStudentId(Integer sessionId, Integer studentId);
    List<Attendance> findBySessionId(Integer sessionId);

    @Query("SELECT new com.ezone.attendance.StudentAttendanceResponse(a.session.classEntity.className, a.session.title, a.session.sessionDate, a.status, a.note) " +
           "FROM Attendance a WHERE a.student.username = :username")
    List<StudentAttendanceResponse> findAttendanceForStudent(@Param("username") String username);
}
