package com.ezone.attendance;

import com.ezone.classroom.ClassSession;
import com.ezone.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attendance", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"session_id", "student_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private ClassSession session;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Convert(converter = com.ezone.common.util.AttendanceStatusConverter.class)
    @Column(nullable = false)
    private Status status;

    private String note;

    public enum Status {
        PRESENT, ABSENT, LATE
    }
}
