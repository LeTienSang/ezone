package com.ezone.assignment;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "scores")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "submission_id", unique = true, nullable = false)
    private Submission submission;

    @Column(nullable = false)
    private BigDecimal score;

    @Column(name = "teacher_feedback")
    private String teacherFeedback;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt = LocalDateTime.now();
}
