// package com.example.bank.model;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;

// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.PrePersist;
// import jakarta.persistence.Table;

// @Entity
// @Table(name = "transactions")
// public class Transaction {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "account_number", nullable = false)
//     private Account account;
    
//     @Column(nullable = false, length = 20)
//     private String type; // DEPOSIT, WITHDRAW, TRANSFER_OUT, TRANSFER_IN
    
//     @Column(nullable = false, precision = 15, scale = 2)
//     private BigDecimal amount;
    
//     @Column(name = "balance_after", precision = 15, scale = 2)
//     private BigDecimal balanceAfter;
    
//     @Column(length = 12)
//     private String relatedAccount;
    
//     @Column(length = 500)
//     private String description;
    
//     @Column(name = "transaction_time")
//     private LocalDateTime transactionTime;
    
//     @PrePersist
//     protected void onCreate() {
//         transactionTime = LocalDateTime.now();
//     }
    
//     public Transaction() {}
    
//     public Transaction(Account account, String type, BigDecimal amount, BigDecimal balanceAfter) {
//         this.account = account;
//         this.type = type;
//         this.amount = amount;
//         this.balanceAfter = balanceAfter;
//     }
    
//     // Getters and Setters
//     public Long getId() { return id; }
//     public void setId(Long id) { this.id = id; }
    
//     public Account getAccount() { return account; }
//     public void setAccount(Account account) { this.account = account; }
    
//     public String getType() { return type; }
//     public void setType(String type) { this.type = type; }
    
//     public BigDecimal getAmount() { return amount; }
//     public void setAmount(BigDecimal amount) { this.amount = amount; }
    
//     public BigDecimal getBalanceAfter() { return balanceAfter; }
//     public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }
    
//     public String getRelatedAccount() { return relatedAccount; }
//     public void setRelatedAccount(String relatedAccount) { this.relatedAccount = relatedAccount; }
    
//     public String getDescription() { return description; }
//     public void setDescription(String description) { this.description = description; }
    
//     public LocalDateTime getTransactionTime() { return transactionTime; }
//     public void setTransactionTime(LocalDateTime transactionTime) { this.transactionTime = transactionTime; }
// }


///1st change
// package com.example.bank.model;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "transactions")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class Transaction {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "account_number", nullable = false)
//     private Account account;
    
//     @Column(nullable = false, length = 20)
//     @Enumerated(EnumType.STRING)
//     private TransactionType type;
    
//     @Column(nullable = false, precision = 15, scale = 2)
//     private BigDecimal amount;
    
//     @Column(name = "balance_after", precision = 15, scale = 2)
//     private BigDecimal balanceAfter;
    
//     @Column(length = 12)
//     private String relatedAccount;
    
//     @Column(length = 500)
//     private String description;
    
//     @Column(name = "transaction_time")
//     private LocalDateTime transactionTime;
    
//     @PrePersist
//     protected void onCreate() {
//         transactionTime = LocalDateTime.now();
//     }
    
//     public enum TransactionType {
//         DEPOSIT, WITHDRAW, TRANSFER_OUT, TRANSFER_IN
//     }
// }

////2nd change
// package com.example.bank.model;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.math.BigDecimal;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "transactions")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class Transaction {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "account_number", nullable = false)
//     private Account account;

//     @Column(nullable = false, length = 20)
//     @Enumerated(EnumType.STRING)
//     private TransactionType type;

//     @Column(nullable = false, precision = 15, scale = 2)
//     private BigDecimal amount;

//     @Column(name = "balance_after", precision = 15, scale = 2)
//     private BigDecimal balanceAfter;

//     @Column(length = 12)
//     private String relatedAccount;

//     @Column(length = 500)
//     private String description;

//     @Column(name = "transaction_time")
//     private LocalDateTime transactionTime;

//     @PrePersist
//     protected void onCreate() {
//         transactionTime = LocalDateTime.now();
//     }

//     /* =========================
//        FACTORY METHODS
//        ========================= */

//     public static Transaction deposit(Account account, BigDecimal amount) {
//         Transaction tx = new Transaction();
//         tx.account = account;
//         tx.type = TransactionType.DEPOSIT;
//         tx.amount = amount;
//         tx.balanceAfter = account.getBalance();
//         tx.description = "Cash deposit";
//         return tx;
//     }

//     public static Transaction withdraw(Account account, BigDecimal amount) {
//         Transaction tx = new Transaction();
//         tx.account = account;
//         tx.type = TransactionType.WITHDRAW;
//         tx.amount = amount;
//         tx.balanceAfter = account.getBalance();
//         tx.description = "Cash withdrawal";
//         return tx;
//     }

//     public static Transaction transferOut(Account from, String toAccount, BigDecimal amount) {
//         Transaction tx = new Transaction();
//         tx.account = from;
//         tx.type = TransactionType.TRANSFER_OUT;
//         tx.amount = amount;
//         tx.balanceAfter = from.getBalance();
//         tx.relatedAccount = toAccount;
//         tx.description = "Transfer to " + toAccount;
//         return tx;
//     }

//     public static Transaction transferIn(Account to, String fromAccount, BigDecimal amount) {
//         Transaction tx = new Transaction();
//         tx.account = to;
//         tx.type = TransactionType.TRANSFER_IN;
//         tx.amount = amount;
//         tx.balanceAfter = to.getBalance();
//         tx.relatedAccount = fromAccount;
//         tx.description = "Transfer from " + fromAccount;
//         return tx;
//     }

//     public enum TransactionType {
//         DEPOSIT,
//         WITHDRAW,
//         TRANSFER_OUT,
//         TRANSFER_IN
//     }
// }

/// 3rd change
package com.example.bank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_number", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TransactionType type;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "balance_after", precision = 15, scale = 2)
    private BigDecimal balanceAfter;

    @Column(length = 20)
    private String relatedAccount;

    @Column(length = 500)
    private String description;

    @Column(name = "transaction_time")
    private LocalDateTime transactionTime;

    @PrePersist
    protected void onCreate() {
        transactionTime = LocalDateTime.now();
    }

    /* ===================== FACTORY METHODS ===================== */

    public static Transaction deposit(Account account, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = account;
        tx.type = TransactionType.DEPOSIT;
        tx.amount = amount;
        tx.balanceAfter = account.getBalance();
        tx.description = "Cash Deposit";
        return tx;
    }

    public static Transaction withdraw(Account account, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = account;
        tx.type = TransactionType.WITHDRAW;
        tx.amount = amount;
        tx.balanceAfter = account.getBalance();
        tx.description = "Cash Withdrawal";
        return tx;
    }

    public static Transaction transferOut(Account from, String toAccount, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = from;
        tx.type = TransactionType.TRANSFER_OUT;
        tx.amount = amount;
        tx.balanceAfter = from.getBalance();
        tx.relatedAccount = toAccount;
        tx.description = "Transfer to " + toAccount;
        return tx;
    }

    public static Transaction transferIn(Account to, String fromAccount, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = to;
        tx.type = TransactionType.TRANSFER_IN;
        tx.amount = amount;
        tx.balanceAfter = to.getBalance();
        tx.relatedAccount = fromAccount;
        tx.description = "Transfer from " + fromAccount;
        return tx;
    }

    /* ============================================================ */

    public enum TransactionType {
        DEPOSIT,
        WITHDRAW,
        TRANSFER_OUT,
        TRANSFER_IN
    }
}
