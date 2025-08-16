package com.doubtdesk.DoubtDeskBackend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "title")
    private String title;

    @Column(name = "category")
    private String category;

    @Column(name = "duration")
    private String duration;

    @Column(name = "price")
    private BigDecimal price; // টাকার হিসাবের জন্য BigDecimal ব্যবহার করা সবথেকে নিরাপদ

    // Subject-এর সাথে Many-to-Many সম্পর্ক
    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "have",  // জয়েন টেবিলের নাম (আপনার ডায়াগ্রাম অনুযায়ী)
            joinColumns = @JoinColumn(name = "course_id"), // এই (Course) টেবিলের ফরেন কী
            inverseJoinColumns = @JoinColumn(name = "subject_id") // অপর (Subject) টেবিলের ফরেন কী
    )
    private Set<Subject> subjects = new HashSet<>();

    // Course.java ক্লাসের ভেতরে নিচের কোড যোগ করুন

    // Payment এর সাথে One-to-Many সম্পর্ক
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Payment> payments = new HashSet<>();
}