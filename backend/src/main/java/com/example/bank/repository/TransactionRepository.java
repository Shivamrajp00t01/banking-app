package com.example.bank.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bank.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountAccountNumberOrderByTransactionTimeDesc(
        String accountNumber
    );

    List<Transaction> findByAccountAccountNumberAndTransactionTimeBetween(
        String accountNumber,
        LocalDateTime start,
        LocalDateTime end
    );
}
