package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminQuestionViewDTO {
    private Long questionId;
    private String questionTitle;
    private String description;
    private String status;
    private LocalDateTime postAt;
    private String studentEmail;
    private String courseName;
    private String subjectName;
    private String solvedByTeacherEmail;
}