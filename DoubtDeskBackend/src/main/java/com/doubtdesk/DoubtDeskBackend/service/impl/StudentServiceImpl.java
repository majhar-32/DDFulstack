package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.StudentRequestDTO;
import com.doubtdesk.DoubtDeskBackend.dto.StudentResponseDTO;
import com.doubtdesk.DoubtDeskBackend.entity.Student;
import com.doubtdesk.DoubtDeskBackend.repository.StudentRepository;
import com.doubtdesk.DoubtDeskBackend.repository.UserRepository;
import com.doubtdesk.DoubtDeskBackend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.doubtdesk.DoubtDeskBackend.dto.CourseResponseDTO;
import com.doubtdesk.DoubtDeskBackend.entity.Payment;
import com.doubtdesk.DoubtDeskBackend.repository.PaymentRepository;
import java.util.List;
import java.util.stream.Collectors;

import java.text.SimpleDateFormat;
import java.util.Date;
import com.doubtdesk.DoubtDeskBackend.entity.User;
import com.doubtdesk.DoubtDeskBackend.entity.Course;

@Service // Spring-কে বলে দেয় যে এটি একটি সার্ভিস ক্লাস
public class StudentServiceImpl implements StudentService {

    @Autowired // StudentRepository-কে এখানে ইনজেক্ট বা ব্যবহার করার জন্য প্রস্তুত করা হচ্ছে
    private StudentRepository studentRepository;

    @Autowired // 3. এই লাইনটি যোগ করুন
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository; // PaymentRepository ইনজেক্ট করুন
    @Autowired // PasswordEncoder ইনজেক্ট করা হলো
    private PasswordEncoder passwordEncoder;


    @Override
    public StudentResponseDTO createStudent(StudentRequestDTO requestDTO) {
        // Step 1: DTO থেকে একটি User অবজেক্ট তৈরি করা
        User user = new User();
        user.setName(requestDTO.getName());
        user.setEmail(requestDTO.getEmail());
        user.setPassword(requestDTO.getPassword()); // পাসওয়ার্ড হ্যাশ করা উচিত
        user.setPhones(requestDTO.getPhones());
        user.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        user.setPhones(requestDTO.getPhones());
        // Step 2: একটি Student অবজেক্ট তৈরি করা
        Student student = new Student();
        student.setInstitute(requestDTO.getInstitute());
        student.setLevelOfStudy(requestDTO.getLevelOfStudy());
        student.setRegistrationDate(new Date());

        // Step 3: Student এবং User এর মধ্যে সংযোগ স্থাপন করা
        student.setUser(user);

        // Step 4: Student অবজেক্টটি সেভ করা (এর সাথে User ও সেভ হয়ে যাবে)
        Student savedStudent = studentRepository.save(student);

        // Step 5: Response DTO তৈরি করে ফেরত পাঠানো
        return mapToResponseDTO(savedStudent);
    }

    // mapToResponseDTO মেথডটিও সামান্য আপডেট করতে হবে
    private StudentResponseDTO mapToResponseDTO(Student student) {
        StudentResponseDTO responseDTO = new StudentResponseDTO();
        responseDTO.setUserId(student.getUser().getUserId()); // এখন user অবজেক্ট থেকে userId নিতে হবে
        responseDTO.setStudentId(student.getStudentId());
        responseDTO.setName(student.getUser().getName()); // user অবজেক্ট থেকে name নিতে হবে
        responseDTO.setEmail(student.getUser().getEmail()); // user অবজেক্ট থেকে email নিতে হবে
        responseDTO.setInstitute(student.getInstitute());
        responseDTO.setLevelOfStudy(student.getLevelOfStudy());

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        responseDTO.setRegistrationDate(formatter.format(student.getRegistrationDate()));

        return responseDTO;
    }



    @Override
    public List<CourseResponseDTO> getEnrolledCourses(String userEmail) {
        // Step 1: ইমেইল দিয়ে ইউজারকে খোঁজা
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + userEmail));

        // Step 2: ইউজার আইডি দিয়ে সব পেমেন্ট খুঁজে বের করা
        List<Payment> payments = paymentRepository.findByStudent_User_UserId(user.getUserId());

        // Step 3: পেমেন্ট থেকে কোর্সের তালিকা তৈরি করে DTO-তে রূপান্তর করা
        return payments.stream()
                .map(payment -> {
                    Course course = payment.getCourse();
                    CourseResponseDTO dto = new CourseResponseDTO();
                    dto.setCourseId(course.getCourseId());
                    dto.setTitle(course.getTitle());
                    dto.setCategory(course.getCategory());
                    dto.setPrice(course.getPrice());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public StudentResponseDTO getProfile(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + userEmail));
        Student student = studentRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Student profile not found for user: " + userEmail));
        return mapToResponseDTO(student);
    }

}