package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.CourseRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.CourseResponseDTO;
import java.util.List;

public interface CourseService {
    List<CourseResponseDTO> getAllCourses();
    CourseResponseDTO createCourse(CourseRequestDTO courseRequestDTO); // নতুন মেথড
    void deleteCourse(Long courseId); // নতুন মেথড

}