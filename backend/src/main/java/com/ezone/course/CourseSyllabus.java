package com.ezone.course;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "COURSE_SYLLABUS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseSyllabus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private CourseCatalog course;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
