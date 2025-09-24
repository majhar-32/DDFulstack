package com.doubtdesk.DoubtDeskBackend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_phone")
public class UserPhone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long phoneId; // টেবিলের নিজস্ব প্রাইমারি কী

    private String phone; // ফোন নম্বর

    // UserPhone ও User এর মধ্যে Many-to-One সম্পর্ক
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Foreign Key কলাম
    @JsonIgnore // API response-এ user অবজেক্টটি দেখানো এড়ানোর জন্য
    private User user;
}