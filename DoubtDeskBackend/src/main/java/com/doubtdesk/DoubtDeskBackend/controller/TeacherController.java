package com.doubtdesk.DoubtDeskBackend.controller;

import com.doubtdesk.DoubtDeskBackend.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.doubtdesk.DoubtDeskBackend.dto.TeacherRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.TeacherResponseDTO;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @PostMapping("/register/teacher")
    public ResponseEntity<TeacherResponseDTO> registerTeacher(@RequestBody TeacherRequestDTO requestDTO) {
        TeacherResponseDTO createdTeacher = teacherService.createTeacher(requestDTO);
        return new ResponseEntity<>(createdTeacher, HttpStatus.CREATED);
    }

    // নতুন মেথড যোগ করা হয়েছে
    @GetMapping("/profile")
    public ResponseEntity<TeacherResponseDTO> getTeacherProfile(@RequestParam String email) {
        try {
            TeacherResponseDTO teacherProfile = teacherService.getProfile(email);
            return ResponseEntity.ok(teacherProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}