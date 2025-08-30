package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.TeacherRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.TeacherResponseDTO;
import com.doubtdesk.DoubtDeskBackend.entity.Teacher;
import com.doubtdesk.DoubtDeskBackend.entity.User;
import com.doubtdesk.DoubtDeskBackend.repository.TeacherRepository;
import com.doubtdesk.DoubtDeskBackend.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.doubtdesk.DoubtDeskBackend.repository.UserRepository;
import com.doubtdesk.DoubtDeskBackend.repository.QuestionRepository;

import java.util.Date;
import java.util.stream.Collectors;


@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public TeacherResponseDTO createTeacher(TeacherRequestDTO requestDTO) {
        User user = new User();
        user.setName(requestDTO.getName());
        user.setEmail(requestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        user.setPhones(requestDTO.getPhones());

        Teacher teacher = new Teacher();
        teacher.setInstitute(requestDTO.getInstitute());
        teacher.setQualification(requestDTO.getQualification());
        teacher.setJoinDate(new Date());
        teacher.setUser(user);

        Teacher savedTeacher = teacherRepository.save(teacher);

        return mapToResponseDTO(savedTeacher);
    }

    private TeacherResponseDTO mapToResponseDTO(Teacher teacher) {
        TeacherResponseDTO dto = new TeacherResponseDTO();
        User user = teacher.getUser();
        dto.setUserId(user.getUserId());
        dto.setTeacherId(teacher.getTeacherId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setInstitute(teacher.getInstitute());
        dto.setQualification(teacher.getQualification());

        // সমাধান করা প্রশ্নের সংখ্যা গণনা
        int solvedCount = questionRepository.findSolvedQuestionsByTeacherEmail(user.getEmail()).size();
        dto.setSolvedQuestionsCount(solvedCount);

        return dto;
    }

    // নতুন মেথড যোগ করা হয়েছে
    @Override
    public TeacherResponseDTO getProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        Teacher teacher = teacherRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Teacher profile not found for user: " + userEmail));

        return mapToResponseDTO(teacher);
    }
}