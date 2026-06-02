package com.ezone.assignment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {
    private Integer id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Integer maxScore;
    private String submissionStatus; // "submitted" or "pending"
    private SubmissionResponse submission;
}
