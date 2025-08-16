package com.doubtdesk.DoubtDeskBackend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private String courseName;
    private String studentEmail;
    private BigDecimal amount;
    private String paymentMethod;
    private LocalDateTime paymentDate;
    // Transaction ID-ও যোগ করা যেতে পারে যদি Payment entity-তে থাকে
}