package com.ezone.assignment;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAssignmentRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String description;

    @NotBlank(message = "Hạn nộp không được để trống")
    private String dueDate;

    @NotNull(message = "Điểm tối đa không được để trống")
    @Min(value = 1, message = "Điểm tối đa phải lớn hơn 0")
    private Integer maxScore;
}
