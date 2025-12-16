package com.example.bank.service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;

public interface PdfService {
    ByteArrayOutputStream generateStatement(String accountNumber, LocalDateTime startDate, LocalDateTime endDate);
}