package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class TeacherResponseDTO {
    private Long userId;
    private Long teacherId;
    private String name;
    private String email;
    private String institute;
    private String qualification;
    private boolean isActive; // <-- স্ট্যাটাস দেখানোর জন্য এই ফিল্ডটি যোগ করুন
    private int solvedQuestionsCount; // <-- সমাধান করা প্রশ্নের সংখ্যা
}