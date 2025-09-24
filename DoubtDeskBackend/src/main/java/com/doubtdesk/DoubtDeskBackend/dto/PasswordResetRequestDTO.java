package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class PasswordResetRequestDTO {
    private String email;
}