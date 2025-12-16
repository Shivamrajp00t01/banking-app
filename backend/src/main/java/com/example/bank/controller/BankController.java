package com.example.bank.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.example.bank.dto.*;
import com.example.bank.model.Account;
import com.example.bank.service.BankService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BankController {

    private final BankService bankService;

    // ✅ CREATE ACCOUNT
    @PostMapping("/create")
    public String createAccount(@RequestBody CreateAccountRequest request) {
        return bankService.createAccount(request);
    }

    // ✅ GET ACCOUNT DETAILS
    @GetMapping("/{accountNumber}")
    public AccountResponse getAccount(@PathVariable String accountNumber) {
        return bankService.getAccount(accountNumber);
    }

    // ✅ GET ALL ACCOUNTS
    @GetMapping
    public List<AccountResponse> getAllAccounts() {
        return bankService.getAllAccounts();
    }

    // ✅ DEPOSIT
    @PostMapping("/{accountNumber}/deposit")
    public void deposit(
            @PathVariable String accountNumber,
            @RequestBody MoneyRequest request
    ) {
        bankService.deposit(accountNumber, request.getAmount());
    }

    // ✅ WITHDRAW
    @PostMapping("/{accountNumber}/withdraw")
    public void withdraw(
            @PathVariable String accountNumber,
            @RequestBody MoneyRequest request
    ) {
        bankService.withdraw(accountNumber, request.getAmount());
    }

    // ✅ TRANSFER
    @PostMapping("/transfer")
    public void transfer(@RequestBody TransferRequest request) {
        bankService.transfer(
                request.getFromAccount(),
                request.getToAccount(),
                request.getAmount(),
                request.getOtp()
        );
    }

    // ✅ TRANSACTIONS
    @GetMapping("/{accountNumber}/transactions")
    public List<TransactionResponse> getTransactions(
            @PathVariable String accountNumber
    ) {
        return bankService.getTransactions(accountNumber);
    }

    // ✅ BALANCE
    @GetMapping("/{accountNumber}/balance")
    public BigDecimal getBalance(@PathVariable String accountNumber) {
        return bankService.getBalance(accountNumber);
    }

    // ✅ ANALYTICS
    @GetMapping("/{accountNumber}/analytics")
    public Map<String, Object> getAnalytics(
            @PathVariable String accountNumber
    ) {
        return bankService.getAnalytics(accountNumber);
    }
}
