package com.example.bank.service;

public interface OtpService {
    void generateAndSendOtp(String accountNumber);
    boolean verifyOtp(String accountNumber, String otp);
    void cleanupExpiredOtps();
}