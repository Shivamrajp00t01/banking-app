package com.example.bank.controller;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.bank.dto.AccountResponse;
import com.example.bank.dto.AnalyticsResponse;
import com.example.bank.dto.CreateAccountRequest;
import com.example.bank.dto.MoneyRequest;
import com.example.bank.dto.TransactionResponse;
import com.example.bank.dto.TransferRequest;
import com.example.bank.service.BankService;
import com.example.bank.service.OtpService;
import com.example.bank.service.PdfService;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@RestController
@RequestMapping("/api/v2/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final BankService bankService;
    private final OtpService otpService;
    private final PdfService pdfService;

    @PostMapping
    public ResponseEntity<String> createAccount(@RequestBody @Valid CreateAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bankService.createAccount(request));
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(bankService.getAllAccounts());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<AccountResponse>> searchAccounts(
            @RequestParam String name) {
        return ResponseEntity.ok(
                bankService.searchByCustomerName(name)
        );
    }


    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String accountNumber, Authentication auth) {
        validate(accountNumber, auth);
        return ResponseEntity.ok(bankService.getAccount(accountNumber));
    }

    @PostMapping("/{accountNumber}/deposit")
public ResponseEntity<BigDecimal> deposit(
        @PathVariable String accountNumber,
        @RequestBody @Valid MoneyRequest request,  // ✅ FIXED: Changed from @RequestParam to @RequestBody
        Authentication auth) {

    validate(accountNumber, auth);
    bankService.deposit(accountNumber, request.getAmount());
    return ResponseEntity.ok(bankService.getBalance(accountNumber));
}

@PostMapping("/{accountNumber}/withdraw")
public ResponseEntity<BigDecimal> withdraw(
        @PathVariable String accountNumber,
        @RequestBody @Valid MoneyRequest request,  // ✅ Already correct
        Authentication auth) {

    validate(accountNumber, auth);
    bankService.withdraw(accountNumber, request.getAmount());
    return ResponseEntity.ok(bankService.getBalance(accountNumber));
}

    @PostMapping("/{accountNumber}/transfer")
    public ResponseEntity<String> transfer(
            @PathVariable String accountNumber,
            @RequestBody @Valid TransferRequest request,
            Authentication auth) {

        validate(accountNumber, auth);
        bankService.transfer(accountNumber, request.getToAccount(), request.getAmount(), request.getOtp());
        return ResponseEntity.ok("Transfer successful");
    }

    @GetMapping("/{accountNumber}/analytics")
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @PathVariable String accountNumber,
            Authentication auth) {
        validate(accountNumber, auth);
        return ResponseEntity.ok(bankService.getAnalytics(accountNumber));
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

        final MediaType application_PDF2 = MediaType.APPLICATION_PDF;
		if (application_PDF2 != null) {
			return ResponseEntity.ok()
			        .contentType(application_PDF2)
			        .body(pdf.toByteArray());
		} else {
			// TODO handle null value
			return null;
		}
    }

    private void validate(String accountNumber, Authentication auth) {
        if (!auth.getName().equals(accountNumber)) {
            throw new SecurityException("Access denied");
        }
    }
}
