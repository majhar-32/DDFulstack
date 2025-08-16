package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class AdminResponseDTO {
    private Long userId;
    private Long adminId;
    private String name;
    private String email;
    private String role;
}