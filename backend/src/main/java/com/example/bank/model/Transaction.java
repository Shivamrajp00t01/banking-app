package com.example.bank.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

//    public static final String TransactionType = null;

//	public static Object TransactionType;

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_number", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private LocalDateTime transactionTime;

	private String relatedAccount;

    // ✅ ENUM
    public enum TransactionType {
        DEPOSIT,
        WITHDRAW,
        TRANSFER_IN,
        TRANSFER_OUT
    }

    @PrePersist
    void onCreate() {
        transactionTime = LocalDateTime.now();
    }

    // ✅ STATIC FACTORY METHODS (SERVICE EXPECTS THESE)
//    public static Transaction deposit(Account acc, BigDecimal amt) {
//        return build(acc, TransactionType.DEPOSIT, amt);
//    }
//
//    public static Transaction withdraw(Account acc, BigDecimal amt) {
//        return build(acc, TransactionType.WITHDRAW, amt);
//    }
//
//    public static Transaction transferOut(Account acc, String to, BigDecimal amt) {
//        return build(acc, TransactionType.TRANSFER_OUT, amt);
//    }
//
//    public static Transaction transferIn(Account acc, String from, BigDecimal amt) {
//        return build(acc, TransactionType.TRANSFER_IN, amt);
//    }
//
//    private static Transaction build(Account acc, TransactionType type,
//                                     BigDecimal amt) {
//        Transaction tx = new Transaction();
//        tx.account = acc;
//        tx.type = type;
//        tx.amount = amt;
//        tx.balanceAfter = acc.getBalance();
//        tx.description = type.name().replace("_", " ");
//        return tx;
//    }
    
    public static Transaction deposit(Account account, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = account;
        tx.type = TransactionType.DEPOSIT;
        tx.amount = amount;
        tx.balanceAfter = account.getBalance();
        tx.description = "Deposit";
        return tx;
    }

    public static Transaction withdraw(Account account, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = account;
        tx.type = TransactionType.WITHDRAW;
        tx.amount = amount;
        tx.balanceAfter = account.getBalance();
        tx.description = "Withdraw";
        return tx;
    }

    public static Transaction transferOut(Account account, String to, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = account;
        tx.type = TransactionType.TRANSFER_OUT;
        tx.amount = amount;
        tx.relatedAccount = to;
        tx.balanceAfter = account.getBalance();
        tx.description = "Transfer Out";
        return tx;
    }

    public static Transaction transferIn(Account account, String from, BigDecimal amount) {
        Transaction tx = new Transaction();
        tx.account = account;
        tx.type = TransactionType.TRANSFER_IN;
        tx.amount = amount;
        tx.relatedAccount = from;
        tx.balanceAfter = account.getBalance();
        tx.description = "Transfer In";
        return tx;
    }
    
//    public Transaction(Account account, TransactionType type,
//            BigDecimal amount, BigDecimal balanceAfter) {
//    		this.account = account;
//    		this.type = type;
//    		this.amount = amount;
//    		this.balanceAfter = balanceAfter;
//    		this.transactionTime = LocalDateTime.now();
//    }
//
//
//
//	public Transaction(Account account2, String string, BigDecimal amount2, BigDecimal balance) {
//		// TODO Auto-generated constructor stub
//	}

	public BigDecimal getAmount() {
		return this.amount;
	}

	public BigDecimal getBalanceAfter() {
	    return balanceAfter;
	}

	public TransactionType getType() {
	    return type;
	}

	public Long getId() {
	    return this.id;
	}

	public String getRelatedAccount() {
	    return this.relatedAccount;
	}

	public String getDescription() {
	    return this.description;
	}

	public LocalDateTime getTransactionTime() {
	    return this.transactionTime;
	}

	public void setDescription(String description) {
	    this.description = description;
	}

	public void setRelatedAccount(String relatedAccount) {
	    this.relatedAccount = relatedAccount;
	}

	public void setAccount(Account account) {
	    this.account = account;
	}

	public void setType(TransactionType type) {
	    this.type = type;
	}

	public void setAmount(BigDecimal amount) {
	    this.amount = amount;
	}

	public void setBalanceAfter(BigDecimal balanceAfter) {
	    this.balanceAfter = balanceAfter;
	}





    // getters & setters
}
