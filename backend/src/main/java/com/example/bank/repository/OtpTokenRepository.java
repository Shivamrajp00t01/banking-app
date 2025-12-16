// package com.example.bank.repository;

// import com.example.bank.model.OtpToken;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;

// import java.time.LocalDateTime;
// import java.util.List;
// import java.util.Optional;

// @Repository
// public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    
//     Optional<OtpToken> findTopByAccountNumberAndUsedFalseOrderByCreatedAtDesc(String accountNumber);
    
//     List<OtpToken> findByExpiryTimeBefore(LocalDateTime time);
    
//     void deleteByAccountNumber(String accountNumber);
// }

///////

package com.example.bank.repository;

import com.example.bank.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    /**
     * ✅ Used to fetch latest unused OTP
     */
    Optional<OtpToken> findTopByAccountNumberAndUsedFalseOrderByCreatedAtDesc(
            String accountNumber
    );

    /**
     * ✅ Alias used by service layer
     */
    default Optional<OtpToken> findLatest(String accountNumber) {
        return findTopByAccountNumberAndUsedFalseOrderByCreatedAtDesc(accountNumber);
    }

    /**
     * ✅ Fetch expired tokens
     */
    List<OtpToken> findByExpiryTimeBefore(LocalDateTime time);

    /**
     * ✅ Delete expired tokens (used by service)
     */
    default void deleteExpired(LocalDateTime time) {
        List<OtpToken> expiredTokens = findByExpiryTimeBefore(time);
        deleteAll(expiredTokens);
    }

    /**
     * ✅ Cleanup all tokens for an account
     */
    void deleteByAccountNumber(String accountNumber);
}
