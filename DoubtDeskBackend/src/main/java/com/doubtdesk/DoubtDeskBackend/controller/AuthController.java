package com.doubtdesk.DoubtDeskBackend.controller;

import com.doubtdesk.DoubtDeskBackend.dto.*;
import com.doubtdesk.DoubtDeskBackend.service.AdminService;
import com.doubtdesk.DoubtDeskBackend.service.AuthService;
import com.doubtdesk.DoubtDeskBackend.service.StudentService;
import com.doubtdesk.DoubtDeskBackend.service.TeacherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<StudentResponseDTO> registerStudent(@Valid @RequestBody StudentRequestDTO requestDTO) {
        StudentResponseDTO createdStudent = studentService.createStudent(requestDTO);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    @PostMapping("/register/teacher")
    public ResponseEntity<TeacherResponseDTO> registerTeacher(@RequestBody TeacherRequestDTO requestDTO) {
        TeacherResponseDTO createdTeacher = teacherService.createTeacher(requestDTO);
        return new ResponseEntity<>(createdTeacher, HttpStatus.CREATED);
    }

    @PostMapping("/register/admin")
    public ResponseEntity<AdminResponseDTO> registerAdmin(@RequestBody AdminRequestDTO requestDTO) {
        AdminResponseDTO createdAdmin = adminService.createAdmin(requestDTO);
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody LoginRequestDTO loginRequestDTO) {
        try {
            LoginResponseDTO response = authService.loginUser(loginRequestDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // নতুন মেথডগুলো এখানে যোগ করুন
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> requestPasswordReset(@RequestBody PasswordResetRequestDTO requestDTO) {
        try {
            authService.requestPasswordReset(requestDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Void> verifyOtp(@RequestBody OtpVerificationRequestDTO requestDTO) {
        if (authService.verifyOtp(requestDTO)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> updatePassword(@RequestBody PasswordUpdateDTO updateDTO) {
        try {
            authService.updatePassword(updateDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}