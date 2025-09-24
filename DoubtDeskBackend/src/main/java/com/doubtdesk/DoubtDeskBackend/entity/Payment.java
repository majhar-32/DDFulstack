package com.doubtdesk.DoubtDeskBackend.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "amount")
    private BigDecimal amount; // টাকার জন্য BigDecimal ব্যবহার করা উত্তম

    @Column(name = "payment_method")
    private String paymentMethod;

    // Student এর সাথে Many-to-One সম্পর্ক
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    // Course এর সাথে Many-to-One সম্পর্ক
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}