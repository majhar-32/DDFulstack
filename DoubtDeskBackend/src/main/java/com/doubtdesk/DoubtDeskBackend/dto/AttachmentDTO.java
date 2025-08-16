package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDTO {
    private String fileName;
    private String fileUrl;
    private String fileType;
}