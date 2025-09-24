package com.doubtdesk.DoubtDeskBackend.repository;

import com.doubtdesk.DoubtDeskBackend.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByUser_UserId(Long userId);

}