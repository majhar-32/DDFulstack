package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.*;
import com.doubtdesk.DoubtDeskBackend.entity.*;
import com.doubtdesk.DoubtDeskBackend.repository.*;
import com.doubtdesk.DoubtDeskBackend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
// AdminServiceImpl.java ফাইলের ভেতরে...
import java.util.stream.Collectors; // ইম্পোর্ট করুন
import java.util.List; // ইম্পোর্ট করুন
import java.util.Map; // ইম্পোর্ট করুন


@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AdminResponseDTO createAdmin(AdminRequestDTO requestDTO) {
        User user = new User();
        user.setName(requestDTO.getName());
        user.setEmail(requestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        user.setPhones(requestDTO.getPhones());

        Admin admin = new Admin();
        admin.setRole(requestDTO.getRole());
        admin.setUser(user);

        Admin savedAdmin = adminRepository.save(admin);

        return mapToResponseDTO(savedAdmin);
    }

    private AdminResponseDTO mapToResponseDTO(Admin admin) {
        AdminResponseDTO dto = new AdminResponseDTO();
        dto.setUserId(admin.getUser().getUserId());
        dto.setAdminId(admin.getAdminId());
        dto.setName(admin.getUser().getName());
        dto.setEmail(admin.getUser().getEmail());
        dto.setRole(admin.getRole());
        return dto;
    }

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<StudentResponseDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToStudentResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void toggleStudentStatus(Long userId, boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // User entity-তে একটি isActive ফিল্ড যোগ করতে হবে
        user.setActive(isActive);
        userRepository.save(user);
    }

    // StudentResponseDTO তে ম্যাপ করার জন্য একটি helper মেথড
    private StudentResponseDTO mapToStudentResponseDTO(Student student) {
        StudentResponseDTO dto = new StudentResponseDTO();
        dto.setUserId(student.getUser().getUserId());
        dto.setStudentId(student.getStudentId());
        dto.setName(student.getUser().getName());
        dto.setEmail(student.getUser().getEmail());
        dto.setInstitute(student.getInstitute());
        // ... অন্যান্য প্রয়োজনীয় ফিল্ড ...
        return dto;
    }

    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private QuestionRepository questionRepository;

    // ... আগের মেথড ...

    @Override
    public List<TeacherResponseDTO> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(this::mapToTeacherResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void toggleTeacherStatus(Long userId, boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for teacher"));
        user.setActive(isActive);
        userRepository.save(user);
    }

    // TeacherResponseDTO তে ম্যাপ করার জন্য একটি helper মেথড
    private TeacherResponseDTO mapToTeacherResponseDTO(Teacher teacher) {
        TeacherResponseDTO dto = new TeacherResponseDTO();
        User user = teacher.getUser();
        dto.setUserId(user.getUserId());
        dto.setTeacherId(teacher.getTeacherId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setInstitute(teacher.getInstitute());
        dto.setQualification(teacher.getQualification());
        dto.setActive(user.isActive());

        // সমাধান করা প্রশ্নের সংখ্যা গণনা
        int solvedCount = questionRepository.findSolvedQuestionsByTeacherEmail(user.getEmail()).size();
        dto.setSolvedQuestionsCount(solvedCount);

        return dto;
    }
    @Override
    public List<AdminQuestionViewDTO> getAllQuestionsForAdmin() {
        return questionRepository.findAll().stream()
                .map(this::mapToAdminQuestionViewDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    private AdminQuestionViewDTO mapToAdminQuestionViewDTO(Question question) {
        AdminQuestionViewDTO dto = new AdminQuestionViewDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuestionTitle(question.getQuestionTitle());
        dto.setDescription(question.getDescription());
        dto.setStatus(question.getStatus());
        dto.setPostAt(question.getPostAt());

        // ছাত্রের ইমেইল (যদি থাকে)
        question.getAskingStudents().stream().findFirst().ifPresent(student ->
                dto.setStudentEmail(student.getUser().getEmail())
        );

        // কোর্সের নাম (যদি থাকে)
        if (question.getCourse() != null) {
            dto.setCourseName(question.getCourse().getTitle());
        }

        // বিষয়ের নাম
        dto.setSubjectName(question.getSubject().getSubjectName());

        // সমাধানকারী শিক্ষকের ইমেইল (যদি থাকে)
        if (question.getAnswer() != null && question.getAnswer().getTeacher() != null) {
            dto.setSolvedByTeacherEmail(question.getAnswer().getTeacher().getUser().getEmail());
        }

        return dto;
    }

    @Autowired
    private PaymentRepository paymentRepository;

    // ... আগের মেথড ...

    @Override
    public List<PaymentResponseDTO> getMoneyFlowData() {
        return paymentRepository.findAll().stream()
                .map(this::mapToPaymentResponseDTO)
                .collect(Collectors.toList());
    }

    private PaymentResponseDTO mapToPaymentResponseDTO(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setCourseName(payment.getCourse().getTitle());
        dto.setStudentEmail(payment.getStudent().getUser().getEmail());
        dto.setAmount(payment.getAmount());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentDate(payment.getPaymentDate());
        return dto;
    }

    // নতুন মেথড যোগ করা হয়েছে
    @Override
    public AdminResponseDTO getProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        Admin admin = adminRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Admin profile not found for user: " + userEmail));
        return mapToResponseDTO(admin);
    }
}