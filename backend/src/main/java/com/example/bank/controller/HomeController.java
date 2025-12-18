package com.example.bank.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, Object> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "running");
        response.put("message", "Apana Bank Backend is Running! ✅");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "accounts", "/api/accounts",
            "h2Console", "/h2-console"
        ));
        return response;
    }
}