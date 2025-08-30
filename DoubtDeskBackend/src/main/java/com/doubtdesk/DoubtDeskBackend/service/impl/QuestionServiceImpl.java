package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.AttachmentDTO;
import com.doubtdesk.DoubtDeskBackend.dto.QuestionRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.QuestionResponseDTO;
import com.doubtdesk.DoubtDeskBackend.dto.SolutionRequestDTO;
import com.doubtdesk.DoubtDeskBackend.entity.*;
import com.doubtdesk.DoubtDeskBackend.repository.*;
import com.doubtdesk.DoubtDeskBackend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired private QuestionRepository questionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private StudentRepository studentRepository;
    @Autowired private SubjectRepository subjectRepository;
    @Autowired private CourseRepository courseRepository;
    @Autowired private TeacherRepository teacherRepository;
    @Autowired private AnswerRepository answerRepository;

    @Override
    public QuestionResponseDTO createQuestion(QuestionRequestDTO requestDTO) {
        User user = userRepository.findByEmail(requestDTO.getStudentEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepository.findByUser_UserId(user.getUserId()).orElseThrow(() -> new RuntimeException("Student not found"));
        Subject subject = subjectRepository.findBySubjectName(requestDTO.getSubjectName()).orElseGet(() -> {
            Subject newSubject = new Subject();
            newSubject.setSubjectName(requestDTO.getSubjectName());
            return subjectRepository.save(newSubject);
        });
        Course course = courseRepository.findByTitle(requestDTO.getCourseName()).orElseThrow(() -> new RuntimeException("Course not found"));

        Question question = new Question();
        question.setQuestionTitle(requestDTO.getQuestionTitle());
        question.setDescription(requestDTO.getDescription());
        question.setSubject(subject);
        question.setCourse(course);
        question.setPostAt(LocalDateTime.now());
        question.setStatus("pending");

        if (requestDTO.getAttachments() != null && !requestDTO.getAttachments().isEmpty()) {
            for (AttachmentDTO dto : requestDTO.getAttachments()) {
                Attachment attachment = new Attachment();
                attachment.setFileName(dto.getFileName());
                attachment.setFileUrl(dto.getFileUrl());
                attachment.setFileType(dto.getFileType());
                attachment.setQuestion(question);
                question.getAttachments().add(attachment);
            }
        }

        question.getAskingStudents().add(student);
        Question savedQuestion = questionRepository.save(question);
        return mapToResponseDTO(savedQuestion, student);
    }

    // আপডেট করা মেথড
    @Override
    public Page<QuestionResponseDTO> getPendingQuestionsForTeacher(String teacherEmail, Pageable pageable) {
        Page<Question> pending = questionRepository.findByStatus("pending", pageable);
        Page<Question> followUps = questionRepository.findFollowUpQuestionsForTeacher(teacherEmail, pageable);

        List<Question> allPendingQuestions = new java.util.ArrayList<>();
        allPendingQuestions.addAll(pending.getContent());
        allPendingQuestions.addAll(followUps.getContent());

        // ডুপ্লিকেট প্রশ্ন বাদ দেওয়া
        List<Question> distinctQuestions = allPendingQuestions.stream().distinct().collect(Collectors.toList());

        // মোট প্রশ্নের সংখ্যা গণনা
        long totalQuestions = questionRepository.countByStatus("pending") + questionRepository.findFollowUpQuestionsForTeacher(teacherEmail, Pageable.unpaged()).getTotalElements();

        List<QuestionResponseDTO> dtos = distinctQuestions.stream()
                .map(q -> mapToResponseDTO(q, q.getAskingStudents().stream().findFirst().orElse(null)))
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, totalQuestions);
    }

    // এই মেথডটি এখন প্রশ্ন এবং উত্তর উভয়ের অ্যাটাচমেন্ট সঠিকভাবে যোগ করবে
    private QuestionResponseDTO mapToResponseDTO(Question question, Student student) {
        QuestionResponseDTO dto = new QuestionResponseDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuestionTitle(question.getQuestionTitle());
        dto.setDescription(question.getDescription());
        dto.setStatus(question.getStatus());
        dto.setPostAt(question.getPostAt());
        dto.setSubjectName(question.getSubject().getSubjectName());

        if (student != null && student.getUser() != null) {
            dto.setStudentName(student.getUser().getName());
            dto.setStudentEmail(student.getUser().getEmail());
        }

        // প্রশ্নের সাথে থাকা অ্যাটাচমেন্ট যোগ করা হচ্ছে
        if (question.getAttachments() != null && !question.getAttachments().isEmpty()) {
            dto.setQuestionAttachments(question.getAttachments().stream()
                    .map(att -> new AttachmentDTO(att.getFileName(), att.getFileUrl(), att.getFileType()))
                    .collect(Collectors.toList()));
        } else {
            dto.setQuestionAttachments(Collections.emptyList());
        }

        // উত্তরের সাথে থাকা অ্যাটাচমেন্ট যোগ করা হচ্ছে
        if (question.getAnswer() != null) {
            dto.setSolutionText(question.getAnswer().getAnswerText());
            dto.setAnswerAt(question.getAnswer().getAnswerAt()); // <-- এই লাইনটি যোগ করুন
            if (question.getAnswer().getTeacher() != null && question.getAnswer().getTeacher().getUser() != null) {
                dto.setSolvedByTeacherName(question.getAnswer().getTeacher().getUser().getEmail()); // এখানে ইমেইল ব্যবহার করা হলো
            }
            if (question.getAnswer().getAttachments() != null && !question.getAnswer().getAttachments().isEmpty()) {
                dto.setSolutionAttachments(question.getAnswer().getAttachments().stream()
                        .map(att -> new AttachmentDTO(att.getFileName(), att.getFileUrl(), att.getFileType()))
                        .collect(Collectors.toList()));
            } else {
                dto.setSolutionAttachments(Collections.emptyList());
            }
        }
        return dto;
    }

    // নতুন পেজিনেশন সহ মেথড
    @Override
    public Page<QuestionResponseDTO> getQuestionsByStudentEmail(String email, Pageable pageable) {
        User user = userRepository.findByEmail(email).orElse(null);
        Student student = (user != null) ? studentRepository.findByUser_UserId(user.getUserId()).orElse(null) : null;
        if (student == null) {
            return Page.empty();
        }
        Page<Question> questionsPage = questionRepository.findQuestionsByStudentEmail(email, pageable);
        List<QuestionResponseDTO> dtos = questionsPage.getContent().stream()
                .map(question -> mapToResponseDTO(question, student))
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, questionsPage.getTotalElements());
    }

    @Override
    public Page<QuestionResponseDTO> getQuestionsByStudentEmailAndCourse(String email, String courseName, Pageable pageable) {
        User user = userRepository.findByEmail(email).orElse(null);
        Student student = (user != null) ? studentRepository.findByUser_UserId(user.getUserId()).orElse(null) : null;
        if (student == null) {
            return Page.empty();
        }
        Page<Question> questionsPage = questionRepository.findQuestionsByStudentEmailAndCourseName(email, courseName, pageable);
        List<QuestionResponseDTO> dtos = questionsPage.getContent().stream()
                .map(question -> mapToResponseDTO(question, student))
                .collect(Collectors.toList());
        return new PageImpl<>(dtos, pageable, questionsPage.getTotalElements());
    }

    // এই মেথডটি আপডেট করা হচ্ছে
    @Override
    public List<QuestionResponseDTO> getSolvedQuestionsByTeacher(String email) {
        List<Question> questions = questionRepository.findSolvedQuestionsByTeacherEmail(email);
        // সমাধানের সময় (answerAt) এর উপর ভিত্তি করে প্রশ্নগুলোকে ডিসেন্ডিং অর্ডারে সাজানো হয়েছে
        return questions.stream()
                .sorted((q1, q2) -> q2.getAnswer().getAnswerAt().compareTo(q1.getAnswer().getAnswerAt()))
                .map(q -> mapToResponseDTO(q, q.getAskingStudents().stream().findFirst().orElse(null)))
                .collect(Collectors.toList());
    }

    @Override
    public void solveQuestion(Long questionId, SolutionRequestDTO solutionDTO) {
        Question question = questionRepository.findById(questionId).orElseThrow(() -> new RuntimeException("Question not found"));
        User teacherUser = userRepository.findByEmail(solutionDTO.getTeacherEmail()).orElseThrow(() -> new RuntimeException("Teacher user not found"));
        Teacher teacher = teacherRepository.findByUser_UserId(teacherUser.getUserId()).orElseThrow(() -> new RuntimeException("Teacher not found"));

        Answer answer = new Answer();
        answer.setAnswerText(solutionDTO.getSolutionText());
        answer.setTeacher(teacher);
        answer.setQuestion(question);
        answer.setAnswerAt(LocalDateTime.now());

        if (solutionDTO.getAttachments() != null && !solutionDTO.getAttachments().isEmpty()) {
            for (AttachmentDTO dto : solutionDTO.getAttachments()) {
                Attachment attachment = new Attachment();
                attachment.setFileName(dto.getFileName());
                attachment.setFileUrl(dto.getFileUrl());
                attachment.setFileType(dto.getFileType());
                attachment.setAnswer(answer);
                answer.getAttachments().add(attachment);
            }
        }

        question.setAnswer(answer);
        if ("follow-up-pending".equals(question.getStatus())) {
            question.setStatus("follow-up-solved");
        } else {
            question.setStatus("solved");
        }
        questionRepository.save(question);
    }
    @Override
    public void markQuestionAsSatisfied(Long questionId) {
        Question question = questionRepository.findById(questionId).orElseThrow(() -> new RuntimeException("Question not found"));
        question.setStatus("satisfied");
        questionRepository.save(question);
    }

    @Override
    public QuestionResponseDTO createFollowUpQuestion(Long originalQuestionId, QuestionRequestDTO followUpRequestDTO) {
        Question original = questionRepository.findById(originalQuestionId).orElseThrow(() -> new RuntimeException("Original question not found"));
        User user = userRepository.findByEmail(followUpRequestDTO.getStudentEmail()).orElseThrow();
        Student student = studentRepository.findByUser_UserId(user.getUserId()).orElseThrow();
        Subject subject = subjectRepository.findBySubjectName(followUpRequestDTO.getSubjectName()).orElseGet(() -> {
            Subject newSubject = new Subject();
            newSubject.setSubjectName(followUpRequestDTO.getSubjectName());
            return subjectRepository.save(newSubject);
        });

        Question followUp = new Question();
        followUp.setQuestionTitle(followUpRequestDTO.getQuestionTitle());
        followUp.setDescription(followUpRequestDTO.getDescription());
        followUp.setSubject(subject);
        followUp.setCourse(original.getCourse());
        followUp.setPostAt(LocalDateTime.now());
        followUp.setStatus("follow-up-pending");
        followUp.setOriginalQuestion(original);
        followUp.getAskingStudents().add(student);

        if (followUpRequestDTO.getAttachments() != null && !followUpRequestDTO.getAttachments().isEmpty()) {
            for (AttachmentDTO dto : followUpRequestDTO.getAttachments()) {
                Attachment attachment = new Attachment();
                attachment.setFileName(dto.getFileName());
                attachment.setFileUrl(dto.getFileUrl());
                attachment.setFileType(dto.getFileType());
                attachment.setQuestion(followUp);
                followUp.getAttachments().add(attachment);
            }
        }

        Question savedFollowUp = questionRepository.save(followUp);
        return mapToResponseDTO(savedFollowUp, student);
    }
    @Override
    public QuestionResponseDTO getQuestionById(Long questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

        // প্রশ্নের সাথে যুক্ত প্রথম ছাত্রটিকে খুঁজে বের করা হচ্ছে
        Student student = question.getAskingStudents().stream().findFirst().orElse(null);

        return mapToResponseDTO(question, student);
    }
}