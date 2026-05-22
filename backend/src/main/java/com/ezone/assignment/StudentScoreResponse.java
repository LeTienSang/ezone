package com.ezone.assignment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentScoreResponse {
    private String className;
    private String assignmentTitle;
    private Integer maxScore;
    private BigDecimal score;
    private String teacherFeedback;
    private LocalDateTime gradedAt;
}
