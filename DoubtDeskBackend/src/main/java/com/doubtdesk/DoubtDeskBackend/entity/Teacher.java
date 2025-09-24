package com.doubtdesk.DoubtDeskBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "teacher")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "institute")
    private String institute;

    @Column(name = "solved_count")
    private Integer solvedCount;

    @Temporal(TemporalType.DATE)
    @Column(name = "join_date")
    private Date joinDate;

    @Column(name = "qualification")
    private String qualification;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Answer> providedAnswers = new HashSet<>();

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feedback> receivedFeedbacks = new HashSet<>();
}