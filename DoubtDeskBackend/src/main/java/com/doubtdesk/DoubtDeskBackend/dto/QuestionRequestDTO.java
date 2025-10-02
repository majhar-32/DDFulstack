package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuestionRequestDTO {
    private String studentEmail;
    private String courseName;
    private String subjectName;
    private String questionTitle;
    private String description;
    private List<AttachmentDTO> attachments;
}