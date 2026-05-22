package com.ezone.classroom;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSessionRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String content;

    private String room;
}
