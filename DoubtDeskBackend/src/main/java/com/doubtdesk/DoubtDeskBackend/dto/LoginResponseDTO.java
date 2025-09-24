package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private Long userId;
    private String email;
    private String name;
    private String role; // "student", "teacher", "admin"
    // ভবিষ্যতে আমরা এখানে একটি JWT টোকেন যোগ করব
    // private String token;
}