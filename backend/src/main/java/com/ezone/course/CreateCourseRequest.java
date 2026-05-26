package com.ezone.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCourseRequest {
    @NotBlank(message = "Tên khóa học không được để trống")
    private String courseName;

    private String description;

    @NotNull(message = "Giá không được để trống")
    private BigDecimal price;

    private String duration;

    private String level;

    private String thumbnail;

    private Boolean isVisible = true;
}
