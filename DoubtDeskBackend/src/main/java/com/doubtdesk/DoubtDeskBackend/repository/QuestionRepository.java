package com.doubtdesk.DoubtDeskBackend.repository;

import com.doubtdesk.DoubtDeskBackend.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q JOIN q.askingStudents s WHERE s.user.email = :email")
    Page<Question> findQuestionsByStudentEmail(@Param("email") String email, Pageable pageable);

    @Query("SELECT q FROM Question q JOIN q.askingStudents s WHERE s.user.email = :email AND q.course.title = :courseName")
    Page<Question> findQuestionsByStudentEmailAndCourseName(@Param("email") String email, @Param("courseName") String courseName, Pageable pageable);

    // ১. শুধুমাত্র সাধারণ পেন্ডিং প্রশ্ন খোঁজার জন্য এই মেথডটি আপডেট করা হয়েছে
    Page<Question> findByStatus(String status, Pageable pageable);

    // ২. শুধুমাত্র একজন নির্দিষ্ট শিক্ষকের জন্য নির্ধারিত ফলো-আপ প্রশ্ন খোঁজার জন্য নতুন কোয়েরি
    @Query("SELECT q FROM Question q WHERE q.status = 'follow-up-pending' AND q.originalQuestion.answer.teacher.user.email = :email")
    Page<Question> findFollowUpQuestionsForTeacher(@Param("email") String email, Pageable pageable);

    // মোট pending প্রশ্নের সংখ্যা জানার জন্য একটি নতুন মেথড
    long countByStatus(String status);

    // শিক্ষকের ইমেইল দিয়ে তার সমাধান করা প্রশ্ন খোঁজার জন্য (এটি অপরিবর্তিত)
    @Query("SELECT q FROM Question q JOIN q.answer a WHERE a.teacher.user.email = :email")
    List<Question> findSolvedQuestionsByTeacherEmail(@Param("email") String email);
}