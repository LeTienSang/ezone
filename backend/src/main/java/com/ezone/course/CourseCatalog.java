package com.ezone.course;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "COURSES_CATALOG")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseCatalog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String courseName;
    private String description;
    private java.math.BigDecimal price;
    private String duration;
    private String level;
    private String thumbnail;
    
    @Column(name = "is_visible")
    private Boolean isVisible = true;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder ASC")
    private java.util.List<CourseSyllabus> syllabus = new java.util.ArrayList<>();
}