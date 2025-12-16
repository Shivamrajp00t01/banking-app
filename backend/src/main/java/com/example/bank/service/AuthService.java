package com.example.bank.service;

import com.example.bank.dto.LoginRequest;
import com.example.bank.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    boolean validateToken(String token);
    String getAccountNumberFromToken(String token);
}