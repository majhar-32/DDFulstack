package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SolutionRequestDTO {
    private String solutionText;
    private String teacherEmail;
    private List<AttachmentDTO> attachments; // <-- নতুন: অ্যাটাচমেন্টের তালিকা

}