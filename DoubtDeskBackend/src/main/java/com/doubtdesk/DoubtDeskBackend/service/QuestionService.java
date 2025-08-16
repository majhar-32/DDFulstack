package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.QuestionRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.QuestionResponseDTO;
import com.doubtdesk.DoubtDeskBackend.dto.SolutionRequestDTO;

import java.util.List;

public interface QuestionService {

    QuestionResponseDTO createQuestion(QuestionRequestDTO questionRequestDTO);

    List<QuestionResponseDTO> getQuestionsByStudentEmail(String email);

    List<QuestionResponseDTO> getQuestionsByStudentEmailAndCourse(String email, String courseName);

    // --- এই মেথড সিগনেচারটি ঠিক করা হয়েছে ---
    List<QuestionResponseDTO> getPendingQuestionsForTeacher(String teacherEmail);

    List<QuestionResponseDTO> getSolvedQuestionsByTeacher(String email);

    void solveQuestion(Long questionId, SolutionRequestDTO solutionRequestDTO);

    void markQuestionAsSatisfied(Long questionId);

    QuestionResponseDTO createFollowUpQuestion(Long originalQuestionId, QuestionRequestDTO followUpRequestDTO);
    QuestionResponseDTO getQuestionById(Long questionId); // নতুন মেথড

}