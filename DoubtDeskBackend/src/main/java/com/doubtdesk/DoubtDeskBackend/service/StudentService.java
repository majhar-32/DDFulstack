package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.StudentRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.StudentResponseDTO;
import com.doubtdesk.DoubtDeskBackend.dto.CourseResponseDTO;

import java.util.List;


public interface StudentService {
    StudentResponseDTO createStudent(StudentRequestDTO studentRequestDTO);
    List<CourseResponseDTO> getEnrolledCourses(String userEmail);

    // নতুন মেথড যোগ করা হয়েছে
    StudentResponseDTO getProfile(String userEmail);

}