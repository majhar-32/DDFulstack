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
@Table(name = "student")
// "extends User" এবং "@PrimaryKeyJoinColumn" মুছে ফেলা হয়েছে
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long studentId; // এটি এখন এই টেবিলের নিজস্ব Primary Key

    @Column(name = "institute")
    private String institute;

    @Column(name = "levelofstudy")
    private String levelOfStudy;

    @Temporal(TemporalType.DATE)
    @Column(name = "reg_date")
    private Date registrationDate;

    // User এর সাথে One-to-One সম্পর্ক তৈরি করা হয়েছে
    @OneToOne(cascade = CascadeType.ALL) // ছাত্র সেভ হলে User ও সেভ হবে
    @JoinColumn(name = "user_id", referencedColumnName = "user_id") // Foreign Key কলাম
    private User user;

    // অন্যান্য সম্পর্কগুলো অপরিবর্তিত থাকবে
    @ManyToMany(mappedBy = "askingStudents")//
    private Set<Question> askedQuestions = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Answer> answers = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Feedback> feedbacks = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Payment> payments = new HashSet<>();
}