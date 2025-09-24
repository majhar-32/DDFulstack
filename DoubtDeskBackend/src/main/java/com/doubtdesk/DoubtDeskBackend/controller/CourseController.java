package com.doubtdesk.DoubtDeskBackend.controller;

import com.doubtdesk.DoubtDeskBackend.dto.CourseResponseDTO;
import com.doubtdesk.DoubtDeskBackend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.doubtdesk.DoubtDeskBackend.dto.CourseRequestDTO; // ইম্পোর্ট করুন
import org.springframework.web.bind.annotation.PostMapping; // ইম্পোর্ট করুন
import org.springframework.web.bind.annotation.RequestBody; // ইম্পোর্ট করুন
import org.springframework.http.HttpStatus; // ইম্পোর্ট করুন
import org.springframework.web.bind.annotation.DeleteMapping; // ইম্পোর্ট করুন
import org.springframework.web.bind.annotation.PathVariable; // ইম্পোর্ট করুন

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // সব কোর্স পাওয়ার জন্য API এন্ডপয়েন্ট
    // GET http://localhost:8080/api/courses
    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAllCourses() {
        List<CourseResponseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
    @PostMapping
    public ResponseEntity<CourseResponseDTO> createCourse(@RequestBody CourseRequestDTO courseRequestDTO) {
        CourseResponseDTO newCourse = courseService.createCourse(courseRequestDTO);
        return new ResponseEntity<>(newCourse, HttpStatus.CREATED);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build(); // 204 No Content স্ট্যাটাস পাঠানো হচ্ছে
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found যদি কোর্স না পাওয়া যায়
        }
    }
}