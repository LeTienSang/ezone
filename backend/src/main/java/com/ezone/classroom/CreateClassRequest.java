package com.ezone.classroom;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateClassRequest {
    @NotNull(message = "ID khóa học không được để trống")
    private Integer courseId;

    @NotNull(message = "ID giảng viên không được để trống")
    private Integer instructorId;

    @NotBlank(message = "Tên lớp học không được để trống")
    private String className;

    @NotBlank(message = "Ngày bắt đầu không được để trống")
    private String startDate;

    @NotBlank(message = "Ngày kết thúc không được để trống")
    private String endDate;

    @Min(value = 1, message = "Sĩ số tối đa phải lớn hơn 0")
    private Integer maxStudents;
}
