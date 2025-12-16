package com.example.bank.repository;

import com.example.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    
    Optional<Account> findByAccountNumber(String accountNumber);
    
    @Query("SELECT a FROM Account a WHERE LOWER(a.customer.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Account> findByCustomerNameContainingIgnoreCase(@Param("name") String name);
    
    Optional<Account> findByCustomerEmail(String email);
    
    boolean existsByAccountNumber(String accountNumber);
}