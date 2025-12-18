package com.example.bank.repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.bank.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    
    boolean existsByAccountNumber(String accountNumber);
    
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByCustomer_NameContainingIgnoreCase(String name);

}