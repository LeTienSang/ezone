package com.ezone.classroom;

import com.ezone.common.dto.PageResponse;
import com.ezone.common.exception.BadRequestException;
import com.ezone.common.exception.ForbiddenException;
import com.ezone.common.exception.ResourceNotFoundException;
import com.ezone.course.CourseCatalog;
import com.ezone.course.CourseCatalogRepository;
import com.ezone.user.Instructor;
import com.ezone.user.InstructorRepository;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
public class ClassroomService {
    private final ClassRepository classRepository;
    private final ClassSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final CourseCatalogRepository courseRepository;
    private final InstructorRepository instructorRepository;

    public ClassroomService(ClassRepository classRepository, 
                            ClassSessionRepository sessionRepository, 
                            UserRepository userRepository,
                            CourseCatalogRepository courseRepository,
                            InstructorRepository instructorRepository) {
        this.classRepository = classRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.instructorRepository = instructorRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ClassEntity> getAllClasses(int page, int size) {
        log.info("Fetching classes, page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<ClassEntity> classPage = classRepository.findAll(pageable);
        return PageResponse.fromPage(classPage);
    }

    @Transactional
    public ClassEntity createClass(CreateClassRequest req) {
        log.info("Creating new class: {} for course ID {}", req.getClassName(), req.getCourseId());
        CourseCatalog course = courseRepository.findById(req.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khóa học"));

        Instructor instructor = instructorRepository.findById(req.getInstructorId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giảng viên"));

        LocalDate start, end;
        try {
            start = LocalDate.parse(req.getStartDate());
            end = LocalDate.parse(req.getEndDate());
        } catch (DateTimeParseException e) {
            log.warn("Invalid date format: start={}, end={}", req.getStartDate(), req.getEndDate());
            throw new BadRequestException("Định dạng ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
        }

        ClassEntity newClass = new ClassEntity();
        newClass.setCourse(course);
        newClass.setInstructor(instructor);
        newClass.setClassName(req.getClassName());
        newClass.setStartDate(start);
        newClass.setEndDate(end);
        newClass.setMaxStudents(req.getMaxStudents() != null ? req.getMaxStudents() : 20);
        newClass.setStatus(ClassStatus.UPCOMING);

        ClassEntity saved = classRepository.save(newClass);
        log.info("Class created successfully: ID={}, name={}", saved.getId(), saved.getClassName());
        return saved;
    }

    @Transactional(readOnly = true)
    public ClassEntity getClassById(Integer classId, String username) {
        log.info("Fetching class details for ID: {} requested by {}", classId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));
        checkClassAccess(username, classEntity);
        return classEntity;
    }

    @Transactional(readOnly = true)
    public List<ClassEntity> getMyClasses(String username) {
        log.info("Fetching classes for user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (user.getRole() == User.Role.TEACHER) {
            return classRepository.findClassesForTeacher(username);
        } else {
            return classRepository.findClassesForStudent(username);
        }
    }

    @Transactional(readOnly = true)
    public List<ClassSession> getClassSessions(Integer classId, String username) {
        log.info("Fetching sessions for class ID: {} for user: {}", classId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));
        
        checkClassAccess(username, classEntity);

        return sessionRepository.findByClassEntityId(classId);
    }

    @Transactional
    public ClassSession updateSession(Integer classId, Integer sessionId, String username, UpdateSessionRequest req) {
        log.info("Updating session ID: {} in class ID: {} by user: {}", sessionId, classId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        if (classEntity.getInstructor() == null || 
            !classEntity.getInstructor().getUser().getUsername().equals(username)) {
            log.warn("Unauthorized session update attempt by user: {} for class ID: {}", username, classId);
            throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
        }

        ClassSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy buổi học"));

        if (!session.getClassEntity().getId().equals(classId)) {
            log.warn("Session ID {} does not belong to class ID {}", sessionId, classId);
            throw new BadRequestException("Buổi học không thuộc lớp này");
        }

        session.setTitle(req.getTitle());
        session.setContent(req.getContent());
        session.setRoom(req.getRoom());

        ClassSession saved = sessionRepository.save(session);
        log.info("Session ID {} updated successfully", sessionId);
        return saved;
    }

    @Transactional(readOnly = true)
    public Set<User> getClassMembers(Integer classId, String username) {
        log.info("Fetching members of class ID: {} requested by {}", classId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        
        if (user.getRole() == User.Role.TEACHER) {
            if (classEntity.getInstructor() == null || 
                !classEntity.getInstructor().getUser().getId().equals(user.getId())) {
                log.warn("User {} tried to view class members without access for class ID {}", username, classId);
                throw new ForbiddenException("Bạn không có quyền xem lớp này");
            }
        }

        Set<User> students = classEntity.getStudents();
        return students;
    }

    @Transactional(readOnly = true)
    public List<ClassSession> getMyTimetable(String username) {
        log.info("Fetching timetable for user: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (user.getRole() == User.Role.TEACHER) {
            return sessionRepository.findScheduleForTeacher(username);
        } else {
            return sessionRepository.findScheduleForStudent(username);
        }
    }

    private void checkClassAccess(String username, ClassEntity classEntity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        
        if (user.getRole() == User.Role.ADMIN) {
            return;
        }
        if (user.getRole() == User.Role.TEACHER) {
            if (classEntity.getInstructor() != null && 
                classEntity.getInstructor().getUser().getId().equals(user.getId())) {
                return;
            }
            throw new ForbiddenException("Bạn không có quyền truy cập lớp học này");
        }
        boolean isMember = classEntity.getStudents().contains(user);
        if (!isMember) {
            throw new ForbiddenException("Bạn không phải là thành viên của lớp học này");
        }
    }
}
