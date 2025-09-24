package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuestionResponseDTO {
    private Long questionId;
    private String questionTitle;
    private String description;
    private String status;
    private LocalDateTime postAt;
    private LocalDateTime answerAt; // <-- এই লাইনটি যোগ করুন
    private String subjectName;
    private String studentName;
    private String studentEmail;
    private String solutionText;
    private String solvedByTeacherName;

    // --- মূল পরিবর্তন এখানে ---
    // প্রশ্ন এবং উত্তরের সাথে থাকা ফাইলগুলোকে ধারণ করার জন্য দুটি আলাদা তালিকা
    private List<AttachmentDTO> questionAttachments;
    private List<AttachmentDTO> solutionAttachments;
}