package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.CourseResponseDTO;
import com.doubtdesk.DoubtDeskBackend.entity.Course;
import com.doubtdesk.DoubtDeskBackend.repository.CourseRepository;
import com.doubtdesk.DoubtDeskBackend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.doubtdesk.DoubtDeskBackend.dto.CourseRequestDTO; // ইম্পোর্ট করুন

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::mapToCourseResponseDTO)
                .collect(Collectors.toList());
    }

    private CourseResponseDTO mapToCourseResponseDTO(Course course) {
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setTitle(course.getTitle());
        dto.setCategory(course.getCategory());
        dto.setPrice(course.getPrice());
        return dto;
    }
    @Override
    public CourseResponseDTO createCourse(CourseRequestDTO requestDTO) {
        Course course = new Course();
        course.setCategory(requestDTO.getCategory());
        course.setTitle(requestDTO.getTitle());
        course.setPrice(requestDTO.getPrice());
        course.setDuration(requestDTO.getDuration());

        Course savedCourse = courseRepository.save(course);

        return mapToCourseResponseDTO(savedCourse);
    }
    @Override
    public void deleteCourse(Long courseId) {
        // কোর্সটি ID দিয়ে খুঁজে বের করা, না পাওয়া গেলে এরর থ্রো করা হবে
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        courseRepository.delete(course);
    }
}