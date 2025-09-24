package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class OtpVerificationRequestDTO {
    private String email;
    private String otp;
}