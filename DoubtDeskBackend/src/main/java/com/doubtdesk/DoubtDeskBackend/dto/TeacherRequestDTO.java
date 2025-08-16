package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class TeacherRequestDTO {
    // User fields
    private String name;
    private String email;
    private String password;
    private List<String> phones;

    // Teacher specific fields
    private String institute;
    private String qualification;
}