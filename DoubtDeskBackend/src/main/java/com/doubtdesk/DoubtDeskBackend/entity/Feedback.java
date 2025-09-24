package com.doubtdesk.DoubtDeskBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;

    @Lob
    @Column(name = "comment")
    private String comment;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    // Student এর সাথে Many-to-One সম্পর্ক
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Teacher এর সাথে Many-to-One সম্পর্ক
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;
}
