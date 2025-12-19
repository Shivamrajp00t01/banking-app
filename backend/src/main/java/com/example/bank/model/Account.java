package com.example.bank.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
public class Account {

    private static final String BANK_CODE = "APB";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Id
    @Column(name = "account_number", length = 15)
    private String accountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type = AccountType.SAVINGS;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    // 🔒 Prevent infinite JSON loop
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Transaction> transactions = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
// ❌ protected Account() {}
// ✅ FIX
    public  Account() {}

    public enum AccountType {
        SAVINGS,
        CURRENT
    }

    @PrePersist
    protected void onCreate() {
        if (this.accountNumber == null) {
            this.accountNumber = generateAccountNumber();
        }
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    private String generateAccountNumber() {
        StringBuilder sb = new StringBuilder(BANK_CODE);
        for (int i = 0; i < 12; i++) {
            sb.append(RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    // ✅ BUSINESS METHODS

    public void deposit(BigDecimal amount) {
        this.balance = this.balance.add(amount);
    }

    public void withdraw(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
    }

    // ✅ GETTERS / SETTERS

    public String getAccountNumber() { return accountNumber; }
    public BigDecimal getBalance() { return balance; }
    public AccountType getType() { return type; }
    public Customer getCustomer() { return customer; }
    public String getPassword() { return password; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setType(AccountType type) { this.type = type; }
    public void setCustomer(Customer customer) { this.customer = customer; }
    public void setPassword(String password) { this.password = password; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}
    