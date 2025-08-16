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

import java.util.Date;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
        dto.setUserId(teacher.getUser().getUserId());
        dto.setTeacherId(teacher.getTeacherId());
        dto.setName(teacher.getUser().getName());
        dto.setEmail(teacher.getUser().getEmail());
        dto.setInstitute(teacher.getInstitute());
        dto.setQualification(teacher.getQualification());
        return dto;
    }
}