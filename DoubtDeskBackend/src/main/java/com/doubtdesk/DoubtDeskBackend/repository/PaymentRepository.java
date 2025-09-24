package com.doubtdesk.DoubtDeskBackend.repository;

import com.doubtdesk.DoubtDeskBackend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.doubtdesk.DoubtDeskBackend.entity.Student;
import com.doubtdesk.DoubtDeskBackend.entity.Course;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStudent_User_UserId(Long userId);
    boolean existsByStudentAndCourse(Student student, Course course);

}