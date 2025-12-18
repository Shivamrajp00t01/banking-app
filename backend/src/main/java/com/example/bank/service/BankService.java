package com.example.bank.service;

import com.example.bank.dto.*;
import com.example.bank.model.Account;

import java.math.BigDecimal;
import java.util.List;

public interface BankService {
    
    String createAccount(CreateAccountRequest request);
    
    AccountResponse getAccount(String accountNumber);
    
    void deposit(String accountNumber, BigDecimal amount);
    
    void withdraw(String accountNumber, BigDecimal amount);
    
    void transfer(String fromAccount, String toAccount, BigDecimal amount, String otp);
    
    List<TransactionResponse> getTransactions(String accountNumber);
    
    List<AccountResponse> getAllAccounts();
    
    List<AccountResponse> searchByCustomerName(String name);
    
    BigDecimal getBalance(String accountNumber);
    
    AnalyticsResponse getAnalytics(String accountNumber);
    
    Account findAccountByNumber(String accountNumber);
}