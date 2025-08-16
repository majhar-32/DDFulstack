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

@RestController // এই ক্লাসটিকে একটি REST কন্ট্রোলার হিসেবে চিহ্নিত করে
@RequestMapping("/api/students") // এই কন্ট্রোলারের সব এন্ডপয়েন্টের ভিত্তি URL
public class StudentController {

    @Autowired
    private StudentService studentService; // আমাদের তৈরি করা সার্ভিসকে ইনজেক্ট করা হচ্ছে

    // একজন নতুন ছাত্র তৈরি করার জন্য API এন্ডপয়েন্ট
    @PostMapping
    public ResponseEntity<StudentResponseDTO> createStudent(@RequestBody StudentRequestDTO requestDTO) {
        // সার্ভিস লেয়ারের createStudent মেথডকে কল করা হচ্ছে
        StudentResponseDTO createdStudent = studentService.createStudent(requestDTO);

        // সফলভাবে তৈরি হওয়ার পর HTTP Status 201 (Created) সহ রেসপন্স পাঠানো হচ্ছে
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);


    }
    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponseDTO>> getMyCourses(@RequestParam String email) {
        List<CourseResponseDTO> courses = studentService.getEnrolledCourses(email);
        return ResponseEntity.ok(courses);
    }
}