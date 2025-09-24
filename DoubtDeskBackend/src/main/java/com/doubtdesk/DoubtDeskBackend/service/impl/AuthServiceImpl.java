package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.LoginRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.LoginResponseDTO;
import com.doubtdesk.DoubtDeskBackend.entity.User;
import com.doubtdesk.DoubtDeskBackend.repository.AdminRepository;
import com.doubtdesk.DoubtDeskBackend.repository.StudentRepository;
import com.doubtdesk.DoubtDeskBackend.repository.TeacherRepository;
import com.doubtdesk.DoubtDeskBackend.repository.UserRepository;
import com.doubtdesk.DoubtDeskBackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired // PasswordEncoder ইনজেক্ট করা হলো
    private PasswordEncoder passwordEncoder;
    @Override
    public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        // Step 1: ইমেইল দিয়ে ইউজারকে খোঁজা
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Step 2: পাসওয়ার্ড যাচাই করা (বাস্তবে এখানে BCrypt ব্যবহার করা উচিত)
        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Step 3: ইউজারের Role (ভূমিকা) নির্ধারণ করা
        String role = determineUserRole(user);

        // Step 4: রেসপন্স তৈরি করে ফেরত পাঠানো
        LoginResponseDTO response = new LoginResponseDTO();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(role);

        return response;
    }

    private String determineUserRole(User user) {
        // আমরা বিভিন্ন রিপোজিটরিতে user_id দিয়ে খুঁজে দেখব
        if (studentRepository.findByUser_UserId(user.getUserId()).isPresent()) {
            return "student";
        }
        if (teacherRepository.findByUser_UserId(user.getUserId()).isPresent()) {
            return "teacher";
        }
        if (adminRepository.findByUser_UserId(user.getUserId()).isPresent()) {
            return "admin";
        }
        throw new RuntimeException("User role could not be determined");
    }
}