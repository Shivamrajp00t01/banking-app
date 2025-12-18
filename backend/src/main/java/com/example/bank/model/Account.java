// package com.example.bank.model;

// import jakarta.persistence.*;
// import java.math.BigDecimal;
// import java.security.SecureRandom;
// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.List;

// @Entity
// @Table(name = "accounts")
// public class Account {
    
//     private static final String BANK_CODE = "APB";
//     private static final SecureRandom random = new SecureRandom();
    
//     @Id
//     private String accountNumber;
    
//     @Column(nullable = false)
//     private String type; // SAVINGS or CURRENT
    
//     @Column(nullable = false, precision = 15, scale = 2)
//     private BigDecimal balance = BigDecimal.ZERO;
    
//     @Column(nullable = false)
//     private String password;
    
//     @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
//     @JoinColumn(name = "customer_id", nullable = false)
//     private Customer customer;
    
//     @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//     private List<Transaction> transactions = new ArrayList<>();
    
//     @Column(name = "created_at")
//     private LocalDateTime createdAt;
    
//     @Column(name = "updated_at")
//     private LocalDateTime updatedAt;
    
//     @PrePersist
//     protected void onCreate() {
//         this.accountNumber = generateAccountNumber();
//         createdAt = LocalDateTime.now();
//         updatedAt = LocalDateTime.now();
//     }
    
//     @PreUpdate
//     protected void onUpdate() {
//         updatedAt = LocalDateTime.now();
//     }
    
//     private String generateAccountNumber() {
//         StringBuilder sb = new StringBuilder(BANK_CODE);
//         for (int i = 0; i < 12; i++) {
//             sb.append(random.nextInt(10));
//         }
//         return sb.toString();
//     }
    
//     public Account() {}
    
//     public Account(String name, BigDecimal balance, String type, String password) {
//         this.customer = new Customer(name, name + "@bank.com"); // Temporary email
//         this.balance = balance;
//         this.type = type;
//         this.password = password;
//     }
    
//     public void deposit(BigDecimal amount) {
//         this.balance = this.balance.add(amount);
//     }
    
//     public void withdraw(BigDecimal amount) {
//         this.balance = this.balance.subtract(amount);
//     }
    
//     // Getters and Setters
//     public String getAccountNumber() { return accountNumber; }
//     public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    
//     public String getType() { return type; }
//     public void setType(String type) { this.type = type; }
    
//     public BigDecimal getBalance() { return balance; }
//     public void setBalance(BigDecimal balance) { this.balance = balance; }
    
//     public String getPassword() { return password; }
//     public void setPassword(String password) { this.password = password; }
    
//     public Customer getCustomer() { return customer; }
//     public void setCustomer(Customer customer) { this.customer = customer; }
    
//     public List<Transaction> getTransactions() { return transactions; }
//     public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
    
//     public LocalDateTime getCreatedAt() { return createdAt; }
//     public LocalDateTime getUpdatedAt() { return updatedAt; }
// }
package com.example.bank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    
    @Id
    @Column(name = "account_number", length = 12)
    private String accountNumber;
    
    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private AccountType type;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private String password;
    
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public void deposit(BigDecimal amount) {
        this.balance = this.balance.add(amount);
    }
    
    public void withdraw(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
    }
    
    public enum AccountType {
        SAVINGS, CURRENT
    }
    public String getAccountNumber() {
        return this.accountNumber;
    }
}