package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CourseRequestDTO {
    private String category; // যেমন: "Engineering"
    private String title;    // যেমন: "Admission Program 2025"
    private BigDecimal price;
    private String duration;
    // ফ্রন্টএন্ড থেকে আসা অন্যান্য ফিল্ডও এখানে যোগ করা যাবে
}