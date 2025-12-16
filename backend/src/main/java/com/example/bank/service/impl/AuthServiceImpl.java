package com.example.bank.service.impl;

import com.example.bank.dto.LoginRequest;
import com.example.bank.dto.LoginResponse;
import com.example.bank.exception.InvalidInputException;
import com.example.bank.model.Account;
import com.example.bank.repository.AccountRepository;
import com.example.bank.security.JwtUtil;
import com.example.bank.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {

        Account account = accountRepository
                .findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new InvalidInputException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new InvalidInputException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(account.getAccountNumber());

        return new LoginResponse(
                token,
                account.getAccountNumber(),
                account.getCustomer().getName(),
                account.getType().name()
        );
    }

    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }

    @Override
    public String getAccountNumberFromToken(String token) {
        return jwtUtil.extractAccountNumber(token);
    }
}
