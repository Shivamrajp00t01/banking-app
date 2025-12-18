package com.example.bank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BankApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(BankApplication.class, args);
        System.out.println("\n✅ Apana Bank Backend Started Successfully!");
        System.out.println("🌐 Server running at: http://localhost:8080");
        System.out.println("📊 H2 Console at: http://localhost:8080/h2-console");
        System.out.println("🔗 API Base URL: http://localhost:8080/api/accounts\n");
    }
}