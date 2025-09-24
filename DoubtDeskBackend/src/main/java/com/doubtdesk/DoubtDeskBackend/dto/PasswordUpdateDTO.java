package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class PasswordUpdateDTO {
    private String email;
    private String newPassword;
}