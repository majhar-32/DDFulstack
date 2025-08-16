package com.doubtdesk.DoubtDeskBackend.controller;

import com.doubtdesk.DoubtDeskBackend.dto.PaymentRequestDTO;
import com.doubtdesk.DoubtDeskBackend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // একটি নতুন পেমেন্ট/এনরোলমেন্ট তৈরি করার জন্য API এন্ডপয়েন্ট
    // POST http://localhost:8080/api/payments
    @PostMapping
    public ResponseEntity<Void> processPayment(@RequestBody PaymentRequestDTO paymentRequestDTO) {
        try {
            paymentService.createPayment(paymentRequestDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // যদি কোনো কিছু খুঁজে না পাওয়া যায়
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}