package com.example.bank.controller;

import com.example.bank.dto.TransferRequest;
import com.example.bank.model.Account;
import com.example.bank.model.Customer;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;


import jakarta.transaction.Transactional;
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
@CrossOrigin(origins = "*")
public class BankController {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    public BankController(AccountRepository accountRepository,
                          TransactionRepository transactionRepository,
                          PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ CREATE ACCOUNT
    @PostMapping
    public ResponseEntity<?> createAccount(
            @RequestParam String name,
            @RequestParam BigDecimal balance,
            @RequestParam(defaultValue = "SAVINGS") String type,
            @RequestParam(defaultValue = "1234") String password,
            @RequestParam(required = false) String email
    ) {
        try {
            Account account = new Account();
            account.setCustomer(new Customer(name, email));
            account.setBalance(balance);

            try {
                account.setType(Account.AccountType.valueOf(type.toUpperCase()));
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest()
                        .body(error("Invalid account type"));
            }

            account.setPassword(passwordEncoder.encode(password));
            Account saved = accountRepository.save(account);

            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error(e.getMessage()));
        }
    }

    // ✅ GET ALL ACCOUNTS
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    // ✅ GET ACCOUNT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAccount(@PathVariable String id) {

        Account account = accountRepository.findById(id).orElse(null);

        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(error("Account not found"));
        }

        return ResponseEntity.ok(account);
    }



    // ✅ DEPOSIT
    @PostMapping("/{id}/deposit")
    @Transactional
    public ResponseEntity<?> deposit(
            @PathVariable String id,
            @RequestParam BigDecimal amount
    ) {
        try {
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (amount.compareTo(BigDecimal.ZERO) <= 0)
                return ResponseEntity.badRequest()
                        .body(error("Amount must be greater than zero"));

            account.deposit(amount);
            accountRepository.save(account);

            Transaction txn = Transaction.deposit(account, amount);
            txn.setDescription("Deposit of ₹" + amount);
            transactionRepository.save(txn);

            return ResponseEntity.ok(account);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    // ✅ WITHDRAW
    @PostMapping("/{id}/withdraw")
    @Transactional
    public ResponseEntity<?> withdraw(
            @PathVariable String id,
            @RequestParam BigDecimal amount
    ) {
        try {
            Account account = accountRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            if (amount.compareTo(BigDecimal.ZERO) <= 0)
                return ResponseEntity.badRequest()
                        .body(error("Amount must be greater than zero"));

            if (account.getBalance().compareTo(amount) < 0)
                return ResponseEntity.badRequest()
                        .body(error("Insufficient balance"));

            account.withdraw(amount);
            accountRepository.save(account);

            Transaction txn = Transaction.withdraw(account, amount);
            txn.setDescription("Withdrawal of ₹" + amount);
            transactionRepository.save(txn);

            return ResponseEntity.ok(account);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    // ✅ TRANSFER
@PostMapping("/{fromId}/transfer")
@Transactional
public ResponseEntity<?> transfer(
        @PathVariable String fromId,
        @RequestBody TransferRequest request  // ✅ Accept JSON body
) {
    try {
        if (fromId.equals(request.getToAccount()))
            return ResponseEntity.badRequest()
                    .body(error("Cannot transfer to same account"));

        Account from = accountRepository.findById(fromId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account to = accountRepository.findById(request.getToAccount())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0)
            return ResponseEntity.badRequest()
                    .body(error("Amount must be greater than zero"));

        if (from.getBalance().compareTo(request.getAmount()) < 0)
            return ResponseEntity.badRequest()
                    .body(error("Insufficient balance"));

        from.withdraw(request.getAmount());
        to.deposit(request.getAmount());

        accountRepository.save(from);
        accountRepository.save(to);

        transactionRepository.save(
                Transaction.transferOut(from, request.getToAccount(), request.getAmount())
        );
        transactionRepository.save(
                Transaction.transferIn(to, fromId, request.getAmount())
        );

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Transfer successful");
        response.put("fromBalance", from.getBalance());
        response.put("toBalance", to.getBalance());

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        return ResponseEntity.badRequest().body(error(e.getMessage()));
    }
}

    // ✅ GET TRANSACTIONS (FIXED TO MATCH REPO)
    @GetMapping("/{id}/transactions")
    public ResponseEntity<?> getTransactions(@PathVariable String id) {
        try {
            accountRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            List<Transaction> transactions =
                    transactionRepository.findTransactionsByAccountNumber(id);

            return ResponseEntity.ok(transactions);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(error(e.getMessage()));
        }
    }

    private Map<String, String> error(String msg) {
        return Map.of("error", msg);
    }
}
