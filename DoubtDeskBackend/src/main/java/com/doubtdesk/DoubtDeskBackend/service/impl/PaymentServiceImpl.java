package com.doubtdesk.DoubtDeskBackend.service.impl;

import com.doubtdesk.DoubtDeskBackend.dto.PaymentRequestDTO;
import com.doubtdesk.DoubtDeskBackend.entity.Course;
import com.doubtdesk.DoubtDeskBackend.entity.Payment;
import com.doubtdesk.DoubtDeskBackend.entity.Student;
import com.doubtdesk.DoubtDeskBackend.entity.User;
import com.doubtdesk.DoubtDeskBackend.repository.CourseRepository;
import com.doubtdesk.DoubtDeskBackend.repository.PaymentRepository;
import com.doubtdesk.DoubtDeskBackend.repository.StudentRepository;
import com.doubtdesk.DoubtDeskBackend.repository.UserRepository;
import com.doubtdesk.DoubtDeskBackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CourseRepository courseRepository;

    @Override
    public void createPayment(PaymentRequestDTO requestDTO) {
        // Step 1: ইমেইল দিয়ে User এবং Student খুঁজে বের করা
        User user = userRepository.findByEmail(requestDTO.getStudentEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + requestDTO.getStudentEmail()));

        Student student = studentRepository.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Student not found for user: " + user.getName()));

        // Step 2: কোর্সের নাম দিয়ে Course খুঁজে বের করা
        Course course = courseRepository.findByTitle(requestDTO.getCourseName())
                .orElseThrow(() -> new RuntimeException("Course not found with name: " + requestDTO.getCourseName()));

        boolean alreadyEnrolled = paymentRepository.existsByStudentAndCourse(student, course);
        if (alreadyEnrolled) {
            throw new RuntimeException("Student is already enrolled in this course.");
        }
        // Step 3: নতুন Payment এন্টিটি তৈরি করা
        Payment payment = new Payment();
        payment.setStudent(student);
        payment.setCourse(course);
        payment.setAmount(course.getPrice()); // কোর্সের মূল্য সেট করা হলো
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentMethod(requestDTO.getPaymentMethod());
        // transactionId আমাদের ডাটাবেস মডেলে নেই, তাই আপাতত এটি সেভ করছি না।
        // প্রয়োজনে Payment entity-তে একটি transactionId ফিল্ড যোগ করা যেতে পারে।

        // Step 4: পেমেন্টটি ডাটাবেসে সেভ করা
        paymentRepository.save(payment);
    }
}