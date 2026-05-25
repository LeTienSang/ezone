package com.ezone.classroom;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CLASS_SESSIONS")
@Getter
@Setter
public class ClassSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassEntity classEntity;
    private String title;
    private LocalDateTime sessionDate;
    private String room;
    private String content;
}