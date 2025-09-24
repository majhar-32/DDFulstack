package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CourseResponseDTO {
    private Long courseId;
    private String title;
    private String category;
    private BigDecimal price;
}