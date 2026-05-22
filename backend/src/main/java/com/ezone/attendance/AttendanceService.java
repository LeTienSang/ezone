package com.ezone.attendance;

import com.ezone.classroom.ClassEntity;
import com.ezone.classroom.ClassRepository;
import com.ezone.classroom.ClassSession;
import com.ezone.classroom.ClassSessionRepository;
import com.ezone.common.exception.BadRequestException;
import com.ezone.common.exception.ForbiddenException;
import com.ezone.common.exception.ResourceNotFoundException;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final ClassRepository classRepository;
    private final ClassSessionRepository sessionRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, 
                             ClassRepository classRepository, 
                             ClassSessionRepository sessionRepository, 
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.classRepository = classRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Attendance> getSessionAttendance(Integer classId, Integer sessionId, String username) {
        log.info("Fetching attendance logs for class ID: {}, session ID: {} by user: {}", classId, sessionId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (user.getRole() == User.Role.TEACHER) {
            if (classEntity.getInstructor() == null || 
                !classEntity.getInstructor().getUser().getId().equals(user.getId())) {
                log.warn("Teacher {} is not assigned to class ID {}", username, classId);
                throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
            }
        }

        return attendanceRepository.findBySessionId(sessionId);
    }

    @Transactional
    public void recordAttendance(Integer classId, Integer sessionId, String username, TakeAttendanceRequest req) {
        log.info("Recording attendance for class ID: {}, session ID: {} by instructor: {}", classId, sessionId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        if (classEntity.getInstructor() == null || 
            !classEntity.getInstructor().getUser().getUsername().equals(username)) {
            log.warn("Instructor {} is not assigned to class ID {}", username, classId);
            throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
        }

        ClassSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy buổi học"));

        if (!session.getClassEntity().getId().equals(classId)) {
            log.warn("Session ID {} does not belong to class ID {}", sessionId, classId);
            throw new BadRequestException("Buổi học không thuộc lớp này");
        }

        for (AttendanceRecord record : req.getRecords()) {
            User student = userRepository.findById(record.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Học viên không tồn tại"));

            if (!classEntity.getStudents().contains(student)) {
                log.warn("Student {} is not a member of class ID {}", student.getFullName(), classId);
                throw new BadRequestException("Học viên " + student.getFullName() + " không phải thành viên lớp này");
            }

            Attendance attendance = attendanceRepository.findBySessionIdAndStudentId(sessionId, student.getId())
                    .orElse(new Attendance());
            
            attendance.setSession(session);
            attendance.setStudent(student);
            try {
                attendance.setStatus(Attendance.Status.valueOf(record.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                log.warn("Invalid attendance status value: {}", record.getStatus());
                throw new BadRequestException("Trạng thái điểm danh không hợp lệ: " + record.getStatus());
            }
            attendance.setNote(record.getNote());
            attendanceRepository.save(attendance);
        }
        log.info("Attendance for session ID {} recorded successfully", sessionId);
    }

    @Transactional(readOnly = true)
    public List<StudentAttendanceResponse> getMyAttendance(String username) {
        log.info("Fetching attendance for student: {}", username);
        return attendanceRepository.findAttendanceForStudent(username);
    }
}
