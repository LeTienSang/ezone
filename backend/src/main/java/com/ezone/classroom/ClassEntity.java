package com.ezone.classroom;

import com.ezone.course.CourseCatalog;
import com.ezone.user.Instructor;
import com.ezone.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private CourseCatalog course;

    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private Instructor instructor;

    @Column(name = "class_name", nullable = false)
    private String className;

    @Column(name = "start_date")
    private java.time.LocalDate startDate;

    @Column(name = "end_date")
    private java.time.LocalDate endDate;

    @Column(name = "max_students")
    private Integer maxStudents = 20;

    @Convert(converter = com.ezone.common.util.ClassStatusConverter.class)
    private ClassStatus status = ClassStatus.UPCOMING;

    @ManyToMany
    @JoinTable(
        name = "class_members",
        joinColumns = @JoinColumn(name = "class_id"),
        inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<User> students = new HashSet<>();
}