package com.doubtdesk.DoubtDeskBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Getter
@Setter
@Entity
@Table(name = "question")
public class Question {
    // ... id, title, description ইত্যাদি ফিল্ড আগের মতোই থাকবে ...

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private Long questionId;


    @Column(name = "question_title")
    private String questionTitle;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status;

    @Column(name = "post_at")
    private LocalDateTime postAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id") // question টেবিলে course_id নামে FK তৈরি হবে
    private Course course;

    @ManyToMany
    @JoinTable(
            name = "ask",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> askingStudents = new HashSet<>();


    // ---- পরিবর্তিত হয়েছে ----
    // Answer এর সাথে One-to-One সম্পর্ক
    @OneToOne(
            mappedBy = "question",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true
    )
    private Answer answer; // Set<Answer> থেকে একটি Answer অবজেক্টে পরিবর্তন করা হয়েছে
    // -------------------------
    // --- এই নতুন সম্পর্কটি যোগ করুন ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_question_id")
    private Question originalQuestion;

    @OneToMany(mappedBy = "originalQuestion", cascade = CascadeType.ALL)
    private Set<Question> followUpQuestions = new HashSet<>();
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Attachment> attachments = new HashSet<>();
}