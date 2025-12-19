package com.example.bank.controller;

import com.example.bank.model.Account;
import com.example.bank.model.Customer;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BankController {
    
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    
    public BankController(AccountRepository accountRepository,
                          TransactionRepository transactionRepository,
                          PasswordEncoder passwordEncoder) {  // ✅ YAHAN
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;       // ✅ YAHAN
    }
    
    // ✅ CREATE ACCOUNT
    @PostMapping
    public ResponseEntity<?> createAccount(
            @RequestParam String name,
            @RequestParam BigDecimal balance,
            @RequestParam(required = false, defaultValue = "SAVINGS") String type,
            @RequestParam(required = false, defaultValue = "1234") String password,
@RequestParam(required = false) String email
) {
        
        try {
        	Account account = new Account();
        	account.setCustomer(new Customer(name, email));
        	account.setBalance(balance);
        	account.setType(Account.AccountType.valueOf(type));
        	account.setPassword(passwordEncoder.encode(password));
            


            Account savedAccount = accountRepository.save(account);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAccount);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
    
    // ✅ GET ALL ACCOUNTS
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }
    
    // ✅ GET ACCOUNT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Object> getAccount(@PathVariable String id) {
        return accountRepository.findById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Account not found")));
    }

    
    // ✅ DEPOSIT
    @PostMapping("/{id}/deposit")
    public ResponseEntity<?> deposit(
            @PathVariable String id,
            @RequestParam BigDecimal amount) {
        
        try {
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Amount must be greater than zero");
            }
            
            account.deposit(amount);
            Account savedAccount = accountRepository.save(account);
            
            // Create transaction
            Transaction transaction = Transaction.deposit(account, amount);
            transaction.setDescription("Deposit of ₹" + amount);
            transactionRepository.save(transaction);

            
            return ResponseEntity.ok(savedAccount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }
    
    // ✅ WITHDRAW
    @PostMapping("/{id}/withdraw")
    public ResponseEntity<?> withdraw(
            @PathVariable String id,
            @RequestParam BigDecimal amount) {
        
        try {
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Amount must be greater than zero");
            }
            
            if (account.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            
            account.withdraw(amount);
            Account savedAccount = accountRepository.save(account);
            
            // Create transaction
            Transaction transaction = Transaction.withdraw(account, amount);
            transaction.setDescription("Withdrawal of ₹" + amount);
            transactionRepository.save(transaction);

            
            return ResponseEntity.ok(savedAccount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }
    
    // ✅ TRANSFER
    @PostMapping("/{fromId}/transfer")
    public ResponseEntity<?> transfer(
            @PathVariable String fromId,
            @RequestParam String toAccount,
            @RequestParam BigDecimal amount) {
        
        try {
            Account fromAccount = accountRepository.findById(fromId)
                    .orElseThrow(() -> new RuntimeException("Source account not found"));
            
            Account toAccountObj = accountRepository.findById(toAccount)
                    .orElseThrow(() -> new RuntimeException("Destination account not found"));
            
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Amount must be greater than zero");
            }
            
            if (fromAccount.getBalance().compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            
            if (fromId.equals(toAccount)) {
                throw new RuntimeException("Cannot transfer to the same account");
            }
            
            // Perform transfer
            fromAccount.withdraw(amount);
            toAccountObj.deposit(amount);
            
            accountRepository.save(fromAccount);
            accountRepository.save(toAccountObj);
            
            // Create transaction records
            Transaction outTransaction =
        Transaction.transferOut(fromAccount, toAccount, amount);

outTransaction.setRelatedAccount(toAccount);
outTransaction.setDescription("Transfer to " + toAccount);

transactionRepository.save(outTransaction);   // ✅ ONLY ONE SAVE

            
            Transaction inTransaction =
        Transaction.transferIn(toAccountObj, fromId, amount);

inTransaction.setRelatedAccount(fromId);
inTransaction.setDescription("Transfer from " + fromId);

transactionRepository.save(inTransaction);

            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Transfer successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        }
    }
    
    // ✅ GET TRANSACTIONS
    @GetMapping("/{id}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable String id) {
        try {
            accountRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
            
            List<Transaction> transactions = transactionRepository
                    .findByAccountAccountNumberOrderByTransactionTimeDesc(id);
            
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        }
    }
    
    // Helper method
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
// Removed to avoid conflict with AccountController