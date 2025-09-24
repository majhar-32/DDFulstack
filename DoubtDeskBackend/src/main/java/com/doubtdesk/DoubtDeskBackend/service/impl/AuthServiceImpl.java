package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.*;
import com.doubtdesk.DoubtDeskBackend.entity.Admin;
import com.doubtdesk.DoubtDeskBackend.entity.User;
import com.doubtdesk.DoubtDeskBackend.entity.ResetToken; // এই লাইনটি যোগ করুন
import com.doubtdesk.DoubtDeskBackend.repository.AdminRepository;
import com.doubtdesk.DoubtDeskBackend.repository.StudentRepository;
import com.doubtdesk.DoubtDeskBackend.repository.TeacherRepository;
import com.doubtdesk.DoubtDeskBackend.repository.UserRepository;
import com.doubtdesk.DoubtDeskBackend.repository.ResetTokenRepository; // এই লাইনটি যোগ করুন
import com.doubtdesk.DoubtDeskBackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.doubtdesk.DoubtDeskBackend.service.EmailService;

import java.time.LocalDateTime; // এই লাইনটি যোগ করুন
import java.util.Optional;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private TeacherRepository tTeacherRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ResetTokenRepository resetTokenRepository; // এই লাইনটি যোগ করুন
    @Autowired
    private EmailService emailService;

    @Override
    public LoginResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String role = determineUserRole(user);

        LoginResponseDTO response = new LoginResponseDTO();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setRole(role);

        return response;
    }

    private String determineUserRole(User user) {
        if (studentRepository.findByUser_UserId(user.getUserId()).isPresent()) {
            return "student";
        }
        if (tTeacherRepository.findByUser_UserId(user.getUserId()).isPresent()) {
            return "teacher";
        }
        if (adminRepository.findByUser_UserId(user.getUserId()).isPresent()) {
            return "admin";
        }
        throw new RuntimeException("User role could not be determined");
    }

    // নতুন মেথডগুলো যোগ করুন
    @Override
    public void requestPasswordReset(PasswordResetRequestDTO requestDTO) {
        User user = userRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + requestDTO.getEmail()));

        String otp = String.format("%06d", new Random().nextInt(999999));

        Optional<ResetToken> existingToken = resetTokenRepository.findByUser(user);
        ResetToken resetToken = existingToken.orElseGet(ResetToken::new);
        resetToken.setOtp(otp);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(2));
        resetToken.setUser(user);
        resetTokenRepository.save(resetToken);

        // ইমেল পাঠানোর জন্য লজিক
        String subject = "DoubtDesk Password Reset OTP";
        String body = "Hello " + user.getName() + ",\n\n"
                + "Your one-time password (OTP) for resetting your DoubtDesk account password is: " + otp + "\n\n"
                + "This OTP is valid for 2 minutes. Do not share it with anyone.\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "Thanks,\n"
                + "DoubtDesk Team";

        emailService.sendSimpleEmail(user.getEmail(), subject, body);
    }

    @Override
    public boolean verifyOtp(OtpVerificationRequestDTO requestDTO) {
        User user = userRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ResetToken resetToken = resetTokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP. Please request a new one."));

        if (resetToken.getOtp().equals(requestDTO.getOtp()) && resetToken.getExpiryDate().isAfter(LocalDateTime.now())) {
            return true;
        } else {
            // OTP যদি ভুল হয় বা মেয়াদ উত্তীর্ণ হয়ে যায়, তাহলে এটিকে মুছে ফেলুন
            resetTokenRepository.delete(resetToken);
            return false;
        }
    }

    @Override
    public void updatePassword(PasswordUpdateDTO updateDTO) {
        User user = userRepository.findByEmail(updateDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // OTP ভেরিফিকেশন সফল হওয়ার পর পাসওয়ার্ড আপডেট করা হবে।
        // এখানে আমরা ধরে নিচ্ছি যে ফ্রন্টএন্ডে OTP ভেরিফিকেশন ইতিমধ্যে সম্পন্ন হয়েছে।
        user.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
        userRepository.save(user);

        // পাসওয়ার্ড আপডেট হওয়ার পর রিসেট টোকেনটি মুছে ফেলুন
        resetTokenRepository.findByUser(user).ifPresent(resetTokenRepository::delete);
    }
}