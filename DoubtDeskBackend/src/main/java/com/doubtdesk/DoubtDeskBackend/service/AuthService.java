package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.LoginRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO);
}