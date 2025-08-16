package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdminRequestDTO {
    // User fields
    private String name;
    private String email;
    private String password;
    private List<String> phones; // ফ্রন্টএন্ডের phoneNumber এখানে আসবে

    // Admin specific fields
    private String role;
}