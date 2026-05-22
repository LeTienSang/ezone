package com.ezone.common.util;

import com.ezone.classroom.*;
import com.ezone.course.*;
import com.ezone.user.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final InstructorRepository instructorRepository;
    private final CourseCatalogRepository courseRepository;
    private final ClassRepository classRepository;
    private final ClassSessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          InstructorRepository instructorRepository,
                          CourseCatalogRepository courseRepository,
                          ClassRepository classRepository,
                          ClassSessionRepository sessionRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.instructorRepository = instructorRepository;
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
        this.sessionRepository = sessionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@ezone.com").isPresent()) {
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

        // 4. Seed Course Catalogs
        CourseCatalog course1 = new CourseCatalog();
        course1.setCourseName("IELTS Ultimate 7.5");
        course1.setDescription("Chương trình luyện thi IELTS chuyên sâu hướng tới mục tiêu 7.5+");
        course1.setPrice(BigDecimal.valueOf(12000000));
        course1.setDuration("3 tháng");
        course1.setLevel("Advanced");
        course1.setThumbnail("/images/ielts-75.jpg");
        courseRepository.save(course1);

        CourseCatalog course2 = new CourseCatalog();
        course2.setCourseName("TOEIC Prep 750");
        course2.setDescription("Khóa học TOEIC bứt phá điểm số trong thời gian ngắn");
        course2.setPrice(BigDecimal.valueOf(4500000));
        course2.setDuration("2 tháng");
        course2.setLevel("Intermediate");
        course2.setThumbnail("/images/toeic-750.jpg");
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
    }
}
