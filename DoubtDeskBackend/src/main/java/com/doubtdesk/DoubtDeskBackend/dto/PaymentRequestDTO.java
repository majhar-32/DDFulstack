package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String studentEmail;
    private String courseName; // ফ্রন্টএন্ড থেকে কোর্সের নাম আসবে
    private String paymentMethod;
    private String transactionId;
}