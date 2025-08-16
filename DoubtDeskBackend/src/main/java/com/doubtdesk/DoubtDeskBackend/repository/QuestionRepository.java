package com.doubtdesk.DoubtDeskBackend.repository;

import com.doubtdesk.DoubtDeskBackend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q JOIN q.askingStudents s WHERE s.user.email = :email")
    List<Question> findQuestionsByStudentEmail(@Param("email") String email);

    @Query("SELECT q FROM Question q JOIN q.askingStudents s WHERE s.user.email = :email AND q.course.title = :courseName")
    List<Question> findQuestionsByStudentEmailAndCourseName(@Param("email") String email, @Param("courseName") String courseName);

    // --- মূল পরিবর্তন এখানে ---

    // ১. শুধুমাত্র সাধারণ পেন্ডিং প্রশ্ন খোঁজার জন্য এই মেথডটি ব্যবহার হবে
    List<Question> findByStatus(String status);

    // ২. শুধুমাত্র একজন নির্দিষ্ট শিক্ষকের জন্য নির্ধারিত ফলো-আপ প্রশ্ন খোঁজার জন্য নতুন কোয়েরি
    @Query("SELECT q FROM Question q WHERE q.status = 'follow-up-pending' AND q.originalQuestion.answer.teacher.user.email = :email")
    List<Question> findFollowUpQuestionsForTeacher(@Param("email") String email);

    // --- findPendingQuestionsForTeacher মেথডটি মুছে ফেলা হয়েছে ---

    // শিক্ষকের ইমেইল দিয়ে তার সমাধান করা প্রশ্ন খোঁজার জন্য (এটি অপরিবর্তিত)
    @Query("SELECT q FROM Question q JOIN q.answer a WHERE a.teacher.user.email = :email")
    List<Question> findSolvedQuestionsByTeacherEmail(@Param("email") String email);
}