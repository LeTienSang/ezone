package com.ezone.course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCourseRequest {
    private String courseName;
    private String description;
    private BigDecimal price;
    private String duration;
    private String level;
    private String thumbnail;
    private Boolean isVisible;
}
