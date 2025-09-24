package com.doubtdesk.DoubtDeskBackend.controller;

import com.doubtdesk.DoubtDeskBackend.dto.QuestionRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.QuestionResponseDTO;
import com.doubtdesk.DoubtDeskBackend.dto.SolutionRequestDTO;
import com.doubtdesk.DoubtDeskBackend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponseDTO> postQuestion(@RequestBody QuestionRequestDTO requestDTO) {
        QuestionResponseDTO newQuestion = questionService.createQuestion(requestDTO);
        return new ResponseEntity<>(newQuestion, HttpStatus.CREATED);
    }

    // মেথড সিগনেচার আপডেট করা হলো
    @GetMapping("/by-student")
    public ResponseEntity<Page<QuestionResponseDTO>> getQuestionsByStudent(
            @RequestParam String email,
            @RequestParam(required = false) String courseName,
            Pageable pageable) { // নতুন Pageable প্যারামিটার যোগ করা হয়েছে

        Page<QuestionResponseDTO> questions;
        if (courseName != null && !courseName.isEmpty()) {
            questions = questionService.getQuestionsByStudentEmailAndCourse(email, courseName, pageable);
        } else {
            questions = questionService.getQuestionsByStudentEmail(email, pageable);
        }
        return ResponseEntity.ok(questions);
    }

    @GetMapping("/solved-by-teacher")
    public ResponseEntity<List<QuestionResponseDTO>> getSolvedQuestionsByTeacher(@RequestParam String email) {
        return ResponseEntity.ok(questionService.getSolvedQuestionsByTeacher(email));
    }

    @PostMapping("/{id}/solve")
    public ResponseEntity<Void> solveQuestion(@PathVariable Long id, @RequestBody SolutionRequestDTO solutionDTO) {
        try {
            questionService.solveQuestion(id, solutionDTO);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status/satisfied")
    public ResponseEntity<Void> markAsSatisfied(@PathVariable Long id) {
        questionService.markQuestionAsSatisfied(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/follow-up")
    public ResponseEntity<QuestionResponseDTO> postFollowUpQuestion(@PathVariable Long id, @RequestBody QuestionRequestDTO requestDTO) {
        QuestionResponseDTO followUp = questionService.createFollowUpQuestion(id, requestDTO);
        return new ResponseEntity<>(followUp, HttpStatus.CREATED);
    }

    // মেথড সিগনেচার আপডেট করা হলো
    @GetMapping("/pending")
    public ResponseEntity<Page<QuestionResponseDTO>> getPendingQuestions(@RequestParam String email, Pageable pageable) {
        return ResponseEntity.ok(questionService.getPendingQuestionsForTeacher(email, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> getQuestionById(@PathVariable Long id) {
        try {
            QuestionResponseDTO question = questionService.getQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}