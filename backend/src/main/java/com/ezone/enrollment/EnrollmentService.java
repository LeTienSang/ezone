package com.ezone.enrollment;

import com.ezone.classroom.ClassEntity;
import com.ezone.classroom.ClassRepository;
import com.ezone.common.dto.PageResponse;
import com.ezone.common.exception.BadRequestException;
import com.ezone.common.exception.ResourceNotFoundException;
import com.ezone.course.CourseCatalog;
import com.ezone.course.CourseCatalogRepository;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepo;
    private final UserRepository userRepo;
    private final CourseCatalogRepository courseRepo;
    private final ClassRepository classRepo;
    private final PasswordEncoder passwordEncoder;

    public EnrollmentService(EnrollmentRepository e, UserRepository u, 
                             CourseCatalogRepository c, ClassRepository cl, 
                             PasswordEncoder passwordEncoder) {
        this.enrollmentRepo = e;
        this.userRepo = u;
        this.courseRepo = c;
        this.classRepo = cl;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Enrollment requestConsultation(EnrollmentRequest req) {
        log.info("Requesting consultation for email: {}, course ID: {}", req.getEmail(), req.getCourseId());
        User user = userRepo.findByEmail(req.getEmail()).orElseGet(() -> {
            log.info("Email {} not found, creating new temp GUEST user", req.getEmail());
            User newUser = new User();
            newUser.setEmail(req.getEmail());
            newUser.setFullName(req.getFullName());
            newUser.setPhone(req.getPhone());
            newUser.setUsername(generateUsernameFromEmail(req.getEmail()));
            newUser.setPassword(passwordEncoder.encode("guest_temp_pass_" + System.currentTimeMillis()));
            newUser.setRole(User.Role.GUEST);
            newUser.setIsActive(true);
            return userRepo.save(newUser);
        });

        CourseCatalog course = courseRepo.findById(req.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(Enrollment.Status.PENDING);
        
        Enrollment saved = enrollmentRepo.save(enrollment);
        log.info("Consultation/Enrollment request created successfully. ID: {}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public PageResponse<Enrollment> getAllEnrollments(String status, int page, int size) {
        log.info("Fetching enrollments with status: {}, page: {}, size: {}", status, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Enrollment> enrollmentPage;

        if (status != null && !status.trim().isEmpty()) {
            try {
                Enrollment.Status statusEnum = Enrollment.Status.valueOf(status.trim().toUpperCase());
                enrollmentPage = enrollmentRepo.findByStatus(statusEnum, pageable);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid enrollment status: {}", status);
                throw new BadRequestException("Trạng thái đơn đăng ký không hợp lệ: " + status);
            }
        } else {
            enrollmentPage = enrollmentRepo.findAll(pageable);
        }

        return PageResponse.fromPage(enrollmentPage);
    }

    @Transactional
    public Enrollment approveEnrollment(Integer id, ApproveRequest req) {
        log.info("Approving enrollment ID: {}, assigning to class ID: {}", id, req.getClassId());
        Enrollment enrollment = enrollmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đăng ký"));
        
        ClassEntity classEntity = classRepo.findById(req.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));
                
        int currentStudents = classEntity.getStudents().size();
        if (currentStudents >= classEntity.getMaxStudents()) {
            log.warn("Class ID {} is full (current size {}, max size {})", req.getClassId(), currentStudents, classEntity.getMaxStudents());
            throw new BadRequestException("Lớp học đã đầy sĩ số");
        }
        
        classEntity.getStudents().add(enrollment.getUser());
        classRepo.save(classEntity);
        
        enrollment.setStatus(Enrollment.Status.PAID);
        Enrollment saved = enrollmentRepo.save(enrollment);
        
        User user = enrollment.getUser();
        if (user.getRole() == User.Role.GUEST) {
            user.setRole(User.Role.STUDENT);
            userRepo.save(user);
            log.info("Upgraded user {} role to STUDENT after enrollment approval", user.getUsername());
        }
        
        log.info("Enrollment ID {} approved and assigned successfully", id);
        return saved;
    }

    @Transactional
    public Enrollment rejectEnrollment(Integer id) {
        log.info("Rejecting enrollment ID: {}", id);
        Enrollment enrollment = enrollmentRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn đăng ký"));
        
        enrollment.setStatus(Enrollment.Status.CANCELLED);
        Enrollment saved = enrollmentRepo.save(enrollment);
        
        log.info("Enrollment ID {} rejected successfully", id);
        return saved;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public java.util.List<Enrollment> getMyEnrollments(String username, String status) {
        log.info("Fetching enrollments for user: {} with status: {}", username, status);
        if (status != null && !status.trim().isEmpty()) {
            try {
                Enrollment.Status statusEnum = Enrollment.Status.valueOf(status.trim().toUpperCase());
                if (statusEnum == Enrollment.Status.PENDING) {
                    return enrollmentRepo.findByUserUsernameAndStatusAndNoPayment(username, statusEnum);
                }
                return enrollmentRepo.findByUserUsernameAndStatus(username, statusEnum);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid enrollment status: {}", status);
                throw new BadRequestException("Trạng thái đơn đăng ký không hợp lệ: " + status);
            }
        }
        return enrollmentRepo.findByUserUsername(username);
    }

    private String generateUsernameFromEmail(String email) {
        String base = email.split("@")[0];
        if (base.length() > 40) {
            base = base.substring(0, 40);
        }
        String username = base;
        int count = 1;
        while (userRepo.findByUsername(username).isPresent()) {
            username = base + count;
            count++;
        }
        return username;
    }
}
