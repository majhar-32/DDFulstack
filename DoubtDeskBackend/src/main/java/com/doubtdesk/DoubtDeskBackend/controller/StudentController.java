package com.doubtdesk.DoubtDeskBackend.controller;

import com.doubtdesk.DoubtDeskBackend.dto.StudentRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.StudentResponseDTO;
import com.doubtdesk.DoubtDeskBackend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.doubtdesk.DoubtDeskBackend.dto.CourseResponseDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@RequestBody StudentRequestDTO requestDTO) {
        StudentResponseDTO createdStudent = studentService.createStudent(requestDTO);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }
    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponseDTO>> getMyCourses(@RequestParam String email) {
        List<CourseResponseDTO> courses = studentService.getEnrolledCourses(email);
        return ResponseEntity.ok(courses);
    }

    // নতুন মেথড যোগ করা হয়েছে
    @GetMapping("/profile")
    public ResponseEntity<StudentResponseDTO> getStudentProfile(@RequestParam String email) {
        try {
            StudentResponseDTO studentProfile = studentService.getProfile(email);
            return ResponseEntity.ok(studentProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}