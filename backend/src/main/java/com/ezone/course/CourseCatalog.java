package com.ezone.course;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses_catalog")
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
}