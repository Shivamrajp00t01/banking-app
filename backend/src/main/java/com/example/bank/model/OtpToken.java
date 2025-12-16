// package com.example.bank.model;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;

// @Entity
// @Table(name = "otp_tokens")
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// public class OtpToken {
    
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
    
//     @Column(name = "account_number", nullable = false, length = 12)
//     private String accountNumber;
    
//     @Column(nullable = false)
//     private String otpHash;
    
//     @Column(name = "expiry_time", nullable = false)
//     private LocalDateTime expiryTime;
    
//     @Column(nullable = false)
//     private boolean used = false;
    
//     @Column(name = "created_at")
//     private LocalDateTime createdAt;
    
//     @PrePersist
//     protected void onCreate() {
//         createdAt = LocalDateTime.now();
//     }
    
//     public boolean isExpired() {
//         return LocalDateTime.now().isAfter(expiryTime);
//     }
// }



///////
package com.example.bank.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_number", nullable = false, length = 20)
    private String accountNumber;

    @Column(name = "otp_hash", nullable = false)
    private String otpHash;

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    /**
     * ✅ CUSTOM CONSTRUCTOR
     * Used by OtpServiceImpl
     */
public OtpToken(String accountNumber, String otpHash, LocalDateTime expiryTime) {
    this.accountNumber = accountNumber;
    this.otpHash = otpHash;
    this.expiryTime = expiryTime;
    this.used = false;
    this.createdAt = LocalDateTime.now();
}

@PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * ✅ Mark OTP as used
     */
    public void markUsed() {
        this.used = true;
    }

    /**
     * ✅ Check expiry
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryTime);
    }
}
