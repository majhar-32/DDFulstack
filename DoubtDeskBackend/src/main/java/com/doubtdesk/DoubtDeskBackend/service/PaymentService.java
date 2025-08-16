package com.doubtdesk.DoubtDeskBackend.service;

import com.doubtdesk.DoubtDeskBackend.dto.PaymentRequestDTO;

public interface PaymentService {
    void createPayment(PaymentRequestDTO paymentRequestDTO);
}