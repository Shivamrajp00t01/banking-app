package com.example.bank.repository;

import com.example.bank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ✅ Get all transactions for an account (latest first)
    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.account.accountNumber = :accountNumber
        ORDER BY t.transactionTime DESC
    """)
    List<Transaction> findTransactionsByAccountNumber(
            @Param("accountNumber") String accountNumber
    );

    // ✅ Get transactions within date range
    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.account.accountNumber = :accountNumber
        AND t.transactionTime BETWEEN :start AND :end
        ORDER BY t.transactionTime DESC
    """)
    List<Transaction> findTransactionsByAccountNumberBetweenDates(
            @Param("accountNumber") String accountNumber,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
