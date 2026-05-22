package com.ezone.enrollment;

import com.ezone.course.CourseCatalog;
import com.ezone.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "course_id")
    private CourseCatalog course;
    @Convert(converter = com.ezone.common.util.EnrollmentStatusConverter.class)
    private Status status = Status.PENDING;
    private LocalDateTime registrationDate = LocalDateTime.now();

    public enum Status {
        PENDING, PAID, CANCELLED
    }
}