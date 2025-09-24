package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.*;

import java.util.List;

public interface AdminService {
    AdminResponseDTO createAdmin(AdminRequestDTO adminRequestDTO);
    List<StudentResponseDTO> getAllStudents();
    void toggleStudentStatus(Long userId, boolean isActive);
    List<TeacherResponseDTO> getAllTeachers();
    void toggleTeacherStatus(Long userId, boolean isActive);
    List<AdminQuestionViewDTO> getAllQuestionsForAdmin();
    void deleteQuestion(Long questionId);
    List<PaymentResponseDTO> getMoneyFlowData();

    AdminResponseDTO getProfile(String userEmail);
}