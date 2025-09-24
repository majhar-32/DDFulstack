package com.doubtdesk.DoubtDeskBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
// @Inheritance(strategy = InheritanceType.JOINED) <-- আগের মতো রাখিনি
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "name")
    private String name;

    @Column(name = "password")
    private String password;

    @Column(name = "email", unique = true)
    private String email;

    @ElementCollection
    @CollectionTable(name = "user_phone", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "phone")
    private List<String> phones;

    @Column(name = "is_active", columnDefinition = "boolean default true")
    private boolean isActive = true;

    // 🔹 Forgot Password extra fields
    @Column(name = "reset_otp")
    private String resetOtp;

    @Column(name = "otp_expiry")
    private LocalDateTime otpExpiry;
}
