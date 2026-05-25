package com.ezone.common.util;

import com.ezone.classroom.*;
import com.ezone.course.*;
import com.ezone.enrollment.*;
import com.ezone.payment.*;
import com.ezone.user.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@lombok.extern.slf4j.Slf4j
@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final InstructorRepository instructorRepository;
    private final CourseCatalogRepository courseRepository;
    private final ClassRepository classRepository;
    private final ClassSessionRepository sessionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          InstructorRepository instructorRepository,
                          CourseCatalogRepository courseRepository,
                          ClassRepository classRepository,
                          ClassSessionRepository sessionRepository,
                          EnrollmentRepository enrollmentRepository,
                          PaymentRepository paymentRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.instructorRepository = instructorRepository;
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
        this.sessionRepository = sessionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.paymentRepository = paymentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@ezone.com").isPresent()) {
            // Check if syllabus needs to be seeded for existing courses
            long coursesCount = courseRepository.count();
            if (coursesCount > 0) {
                java.util.List<CourseCatalog> allCourses = courseRepository.findAll();
                CourseCatalog c1 = allCourses.stream()
                        .filter(c -> c.getCourseName().contains("IELTS"))
                        .findFirst().orElse(null);
                if (c1 != null && c1.getSyllabus().isEmpty()) {
                    log.info("Syllabus is empty, seeding syllabus data dynamically...");
                    c1.getSyllabus().add(new CourseSyllabus(null, c1, "Chặng 1: IELTS Reading & Listening Foundation", "Xây dựng nền tảng từ vựng, ngữ pháp và phát âm cần thiết cho IELTS.", 1));
                    c1.getSyllabus().add(new CourseSyllabus(null, c1, "Chặng 2: Kỹ thuật xử lý các dạng bài thi", "Luyện tập các phương pháp và chiến thuật làm bài cho cả 4 kỹ năng Listening, Reading, Writing, Speaking.", 2));
                    c1.getSyllabus().add(new CourseSyllabus(null, c1, "Chặng 3: Luyện đề và bứt phá Band điểm 7.5+", "Cọ xát với đề thi thật gần đây nhất, sửa bài chi tiết cùng giảng viên chuyên gia.", 3));
                    courseRepository.save(c1);
                    
                    CourseCatalog c2 = allCourses.stream()
                        .filter(c -> c.getCourseName().contains("TOEIC"))
                        .findFirst().orElse(null);
                    if (c2 != null) {
                        c2.getSyllabus().add(new CourseSyllabus(null, c2, "Phần 1: Grammar & Vocabulary Booster", "Củng cố lại toàn bộ các chủ điểm ngữ pháp cốt lõi và từ vựng thông dụng trong bài thi TOEIC mới.", 1));
                        c2.getSyllabus().add(new CourseSyllabus(null, c2, "Phần 2: Listening & Reading Strategy", "Mẹo làm bài nhanh, nhận diện bẫy và chiến lược phân bổ thời gian hiệu quả trong phòng thi.", 2));
                        courseRepository.save(c2);
                    }
                }
            }
            return; // Seeded already
        }

        // 1. Seed Admin
        User admin = new User();
        admin.setEmail("admin@ezone.com");
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("System Admin");
        admin.setPhone("0987654321");
        admin.setRole(User.Role.ADMIN);
        admin.setIsActive(true);
        userRepository.save(admin);

        // 2. Seed Teacher
        User teacherUser = new User();
        teacherUser.setEmail("teacher@ezone.com");
        teacherUser.setUsername("teacher");
        teacherUser.setPassword(passwordEncoder.encode("teacher123"));
        teacherUser.setFullName("John Doe");
        teacherUser.setPhone("0912345678");
        teacherUser.setRole(User.Role.TEACHER);
        teacherUser.setIsActive(true);
        userRepository.save(teacherUser);

        // 3. Seed Instructor
        Instructor instructor = new Instructor();
        instructor.setUser(teacherUser);
        instructor.setBio("IELTS expert with 8.5 band score and 10 years teaching experience.");
        instructor.setSpecialization("IELTS");
        instructor.setExperienceYears(10);
        instructor.setRating(BigDecimal.valueOf(4.9));
        instructorRepository.save(instructor);

        // 4. Seed Course Catalogs (with valid thumbnail URLs)
        CourseCatalog course1 = new CourseCatalog();
        course1.setCourseName("IELTS Ultimate 7.5");
        course1.setDescription("Chương trình luyện thi IELTS chuyên sâu hướng tới mục tiêu 7.5+");
        course1.setPrice(BigDecimal.valueOf(12000000));
        course1.setDuration("3 tháng");
        course1.setLevel("Advanced");
        course1.setThumbnail("https://images.unsplash.com/photo-1546410531-ea4cea477149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        
        course1.getSyllabus().add(new CourseSyllabus(null, course1, "Chặng 1: IELTS Reading & Listening Foundation", "Xây dựng nền tảng từ vựng, ngữ pháp và phát âm cần thiết cho IELTS.", 1));
        course1.getSyllabus().add(new CourseSyllabus(null, course1, "Chặng 2: Kỹ thuật xử lý các dạng bài thi", "Luyện tập các phương pháp và chiến thuật làm bài cho cả 4 kỹ năng Listening, Reading, Writing, Speaking.", 2));
        course1.getSyllabus().add(new CourseSyllabus(null, course1, "Chặng 3: Luyện đề và bứt phá Band điểm 7.5+", "Cọ xát với đề thi thật gần đây nhất, sửa bài chi tiết cùng giảng viên chuyên gia.", 3));
        courseRepository.save(course1);

        CourseCatalog course2 = new CourseCatalog();
        course2.setCourseName("TOEIC Prep 750");
        course2.setDescription("Khóa học TOEIC bứt phá điểm số trong thời gian ngắn");
        course2.setPrice(BigDecimal.valueOf(4500000));
        course2.setDuration("2 tháng");
        course2.setLevel("Intermediate");
        course2.setThumbnail("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        
        course2.getSyllabus().add(new CourseSyllabus(null, course2, "Phần 1: Grammar & Vocabulary Booster", "Củng cố lại toàn bộ các chủ điểm ngữ pháp cốt lõi và từ vựng thông dụng trong bài thi TOEIC mới.", 1));
        course2.getSyllabus().add(new CourseSyllabus(null, course2, "Phần 2: Listening & Reading Strategy", "Mẹo làm bài nhanh, nhận diện bẫy và chiến lược phân bổ thời gian hiệu quả trong phòng thi.", 2));
        courseRepository.save(course2);

        // 5. Seed Class
        ClassEntity classEntity = new ClassEntity();
        classEntity.setCourse(course1);
        classEntity.setInstructor(instructor);
        classEntity.setClassName("IELTS-2024-K01");
        classEntity.setStartDate(LocalDate.now().minusDays(5));
        classEntity.setEndDate(LocalDate.now().plusMonths(3));
        classEntity.setMaxStudents(20);
        classEntity.setStatus(ClassStatus.ACTIVE);
        classRepository.save(classEntity);

        // 6. Seed Class Sessions
        ClassSession session = new ClassSession();
        session.setClassEntity(classEntity);
        session.setTitle("Buổi 1: IELTS Reading Overview");
        session.setSessionDate(LocalDateTime.now().plusDays(1));
        session.setRoom("Phòng Zoom 01");
        session.setContent("Giới thiệu tổng quan và phương pháp làm bài Reading.");
        sessionRepository.save(session);

        // 7. Seed Student (demo account for UC10-UC13)
        User studentUser = new User();
        studentUser.setEmail("student@ezone.com");
        studentUser.setUsername("student");
        studentUser.setPassword(passwordEncoder.encode("student123"));
        studentUser.setFullName("Nguyễn Văn A");
        studentUser.setPhone("0901234567");
        studentUser.setRole(User.Role.STUDENT);
        studentUser.setIsActive(true);
        userRepository.save(studentUser);

        // 8. Seed Enrollment (PAID) for student + course1
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(studentUser);
        enrollment.setCourse(course1);
        enrollment.setStatus(Enrollment.Status.PAID);
        enrollmentRepository.save(enrollment);

        // 9. Add student to class
        classEntity.getStudents().add(studentUser);
        classRepository.save(classEntity);

        // 10. Seed Payment (SUCCESS) for the enrollment
        Payment payment = new Payment();
        payment.setEnrollment(enrollment);
        payment.setAmount(course1.getPrice());
        payment.setPaymentMethod("Chuyển khoản ngân hàng");
        payment.setTransactionId("DEMO-TXN-001");
        payment.setStatus(Payment.Status.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now().minusDays(3));
        paymentRepository.save(payment);
    }
}
