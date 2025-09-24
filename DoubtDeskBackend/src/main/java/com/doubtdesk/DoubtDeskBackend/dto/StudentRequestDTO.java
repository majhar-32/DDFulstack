package com.doubtdesk.DoubtDeskBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class StudentRequestDTO {

    // --- Annotations have been moved to the original fields ---

    @NotEmpty(message = "Name cannot be empty")
    private String name;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private List<String> phones;
    private String institute;
    private String levelOfStudy;

    // --- The duplicate fields below have been removed ---
}