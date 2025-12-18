package com.example.bank.model;

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
    private static final SecureRandom random = new SecureRandom();

    @Id
    private String accountNumber;

    // ✅ ENUM instead of String
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false)
//    private AccountType type = AccountType.SAVINGS;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(nullable = false)
    private String password;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaction> transactions = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ✅ REQUIRED ENUM
    public enum AccountType {
        SAVINGS,
        CURRENT
    }

    @PrePersist
    protected void onCreate() {
        if (accountNumber == null) {
            accountNumber = generateAccountNumber();
        }
        createdAt = LocalDateTime.now();
        setUpdatedAt(LocalDateTime.now());
    }

    @PreUpdate
    protected void onUpdate() {
        setUpdatedAt(LocalDateTime.now());
    }

    private String generateAccountNumber() {
        StringBuilder sb = new StringBuilder(BANK_CODE);
        for (int i = 0; i < 12; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    // ✅ Business methods
    public void deposit(BigDecimal amount) {
        this.balance = this.balance.add(amount);
    }

    public void withdraw(BigDecimal amount) {
        this.balance = this.balance.subtract(amount);
    }

	public BigDecimal getBalance() {
		return this.balance;
	}

	public String getAccountNumber() {
		return this.accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
	    this.accountNumber = accountNumber;
	}

	public void setType(AccountType type) {
	    this.type = type;
	}

	public void setCustomer(Customer customer) {
	    this.customer = customer;
	}

	public void setPassword(String password) {
	    this.password = password;
	}

	public void setBalance(BigDecimal balance) {
	    this.balance = balance;
	}

	public AccountType getType() {
	    return this.type;
	}

	public Customer getCustomer() {
	    return this.customer;
	}

	public LocalDateTime getCreatedAt() {
	    return this.createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public String getPassword() {
	    return this.password;
	}


	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}


    // getters & setters (same as before)
}
