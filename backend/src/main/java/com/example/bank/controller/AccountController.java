package com.example.bank.controller;

import com.example.bank.dto.*;
import com.example.bank.service.BankService;
import com.example.bank.service.OtpService;
import com.example.bank.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final BankService bankService;
    private final OtpService otpService;
    private final PdfService pdfService;

    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<BigDecimal> deposit(
            @PathVariable String accountNumber,
            @RequestBody MoneyRequest request,
            Authentication auth) {

        validate(accountNumber, auth);
        bankService.deposit(accountNumber, request.getAmount());
        return ResponseEntity.ok(bankService.getBalance(accountNumber));
    }

    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<BigDecimal> withdraw(
            @PathVariable String accountNumber,
            @RequestBody MoneyRequest request,
            Authentication auth) {

        validate(accountNumber, auth);
        bankService.withdraw(accountNumber, request.getAmount());
        return ResponseEntity.ok(bankService.getBalance(accountNumber));
    }

    @GetMapping("/{accountNumber}/transactions")
    public ResponseEntity<List<TransactionResponse>> transactions(
            @PathVariable String accountNumber,
            Authentication auth) {

        validate(accountNumber, auth);
        return ResponseEntity.ok(bankService.getTransactions(accountNumber));
    }

    @GetMapping("/{accountNumber}/statement/pdf")
    public ResponseEntity<byte[]> statement(
            @PathVariable String accountNumber,
            Authentication auth) {

        validate(accountNumber, auth);

        ByteArrayOutputStream pdf =
                pdfService.generateStatement(accountNumber,
                        LocalDateTime.now().minusMonths(1),
                        LocalDateTime.now());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.toByteArray());
    }

    private void validate(String accountNumber, Authentication auth) {
        if (!auth.getName().equals(accountNumber)) {
            throw new SecurityException("Access denied");
        }
    }
}
