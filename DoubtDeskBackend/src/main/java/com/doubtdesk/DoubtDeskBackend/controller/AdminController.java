package com.doubtdesk.DoubtDeskBackend.controller;

import com.doubtdesk.DoubtDeskBackend.dto.AdminQuestionViewDTO;
import com.doubtdesk.DoubtDeskBackend.dto.PaymentResponseDTO;
import com.doubtdesk.DoubtDeskBackend.dto.StudentResponseDTO; // StudentResponseDTO ব্যবহার করা হবে
import com.doubtdesk.DoubtDeskBackend.service.AdminService; // AdminService ব্যবহার করা হবে
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.doubtdesk.DoubtDeskBackend.dto.AdminResponseDTO;
import java.util.List;
import java.util.Map;

import com.doubtdesk.DoubtDeskBackend.dto.TeacherResponseDTO; // ইম্পোর্ট করুন


@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    // সব ছাত্রের তালিকা আনার জন্য
    @GetMapping("/students")
    public ResponseEntity<List<StudentResponseDTO>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    // ছাত্রের স্ট্যাটাস পরিবর্তন করার জন্য
    @PatchMapping("/students/{userId}/status")
    public ResponseEntity<Void> toggleStudentStatus(@PathVariable Long userId, @RequestBody Map<String, Boolean> status) {
        adminService.toggleStudentStatus(userId, status.get("isActive"));
        return ResponseEntity.ok().build();
    }
    @GetMapping("/teachers")
    public ResponseEntity<List<TeacherResponseDTO>> getAllTeachers() {
        return ResponseEntity.ok(adminService.getAllTeachers());
    }

    // শিক্ষকের স্ট্যাটাস পরিবর্তন করার জন্য
    @PatchMapping("/teachers/{userId}/status")
    public ResponseEntity<Void> toggleTeacherStatus(@PathVariable Long userId, @RequestBody Map<String, Boolean> status) {
        adminService.toggleTeacherStatus(userId, status.get("isActive"));
        return ResponseEntity.ok().build();
    }
    @GetMapping("/questions")
    public ResponseEntity<List<AdminQuestionViewDTO>> getAllQuestions() {
        return ResponseEntity.ok(adminService.getAllQuestionsForAdmin());
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        adminService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/moneyflow")
    public ResponseEntity<List<PaymentResponseDTO>> getMoneyFlow() {
        return ResponseEntity.ok(adminService.getMoneyFlowData());
    }

    // নতুন মেথড যোগ করা হয়েছে
    @GetMapping("/profile")
    public ResponseEntity<AdminResponseDTO> getAdminProfile(@RequestParam String email) {
        try {
            AdminResponseDTO adminProfile = adminService.getProfile(email);
            return ResponseEntity.ok(adminProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}