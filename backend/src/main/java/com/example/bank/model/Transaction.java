package com.example.bank.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔒 Prevent infinite JSON loop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_number", nullable = false)
    @JsonBackReference
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "balance_after", precision = 19, scale = 2)
    private BigDecimal balanceAfter;

    @Column(length = 255)
    private String description;

    @Column(name = "transaction_time", updatable = false)
    private LocalDateTime transactionTime;

    @Column(name = "related_account", length = 20)
    private String relatedAccount;

    // ✅ REQUIRED no-args constructor
    protected Transaction() {}

    public enum TransactionType {
        DEPOSIT,
        WITHDRAW,
        TRANSFER_IN,
        TRANSFER_OUT
    }

    @PrePersist
    protected void onCreate() {
        this.transactionTime = LocalDateTime.now();
    }

    // ✅ FACTORY METHODS (CONTROLLER EXPECTS THESE)

    public static Transaction deposit(Account account, BigDecimal amount) {
        return build(account, TransactionType.DEPOSIT, amount, null);
    }

    public static Transaction withdraw(Account account, BigDecimal amount) {
        return build(account, TransactionType.WITHDRAW, amount, null);
    }

    public static Transaction transferOut(Account account, String to, BigDecimal amount) {
        return build(account, TransactionType.TRANSFER_OUT, amount, to);
    }

    public static Transaction transferIn(Account account, String from, BigDecimal amount) {
        return build(account, TransactionType.TRANSFER_IN, amount, from);
    }

    private static Transaction build(
            Account account,
            TransactionType type,
            BigDecimal amount,
            String relatedAccount
    ) {
        Transaction tx = new Transaction();
        tx.account = account;
        tx.type = type;
        tx.amount = amount;
        tx.relatedAccount = relatedAccount;
        tx.balanceAfter = account.getBalance();
        tx.description = type.name().replace("_", " ");
        return tx;
    }

    // ✅ GETTERS ONLY (IMMUTABLE DESIGN)

    public Long getId() { return id; }
    public TransactionType getType() { return type; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public String getRelatedAccount() { return relatedAccount; }
    public String getDescription() { return description; }
    public LocalDateTime getTransactionTime() { return transactionTime; }

    public void setDescription(String description) {
        this.description = description;
    }
}
