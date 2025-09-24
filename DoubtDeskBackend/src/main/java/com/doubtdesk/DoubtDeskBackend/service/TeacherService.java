package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.TeacherRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.TeacherResponseDTO;

public interface TeacherService {
    TeacherResponseDTO createTeacher(TeacherRequestDTO teacherRequestDTO);

    // নতুন মেথড যোগ করা হয়েছে
    TeacherResponseDTO getProfile(String userEmail);
}