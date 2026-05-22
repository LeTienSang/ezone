package com.ezone.assignment;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {
    private Integer id;
    private Integer studentId;
    private String studentName;
    private Integer assignmentId;
    private String assignmentTitle;
    private String content;
    private String fileUrl;
    private LocalDateTime submittedAt;
    private BigDecimal score;
    private String teacherFeedback;
}
