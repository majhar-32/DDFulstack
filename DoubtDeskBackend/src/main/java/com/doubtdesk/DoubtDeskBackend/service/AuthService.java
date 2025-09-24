package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.LoginRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.LoginResponseDTO;
import com.doubtdesk.DoubtDeskBackend.dto.PasswordResetRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.OtpVerificationRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.PasswordUpdateDTO;

public interface AuthService {
    LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO);
    void requestPasswordReset(PasswordResetRequestDTO requestDTO);
    boolean verifyOtp(OtpVerificationRequestDTO requestDTO);
    void updatePassword(PasswordUpdateDTO updateDTO);
}