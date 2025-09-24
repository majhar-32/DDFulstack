package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class StudentResponseDTO {
    private Long userId;
    private Long studentId; // আমরা studentId ও পাঠাবো
    private String name;
    private String email;
    private String institute;
    private String levelOfStudy; // Add this new field
    private String registrationDate;
}