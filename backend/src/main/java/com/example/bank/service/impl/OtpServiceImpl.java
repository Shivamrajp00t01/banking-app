// package com.example.bank.service.impl;

// import com.example.bank.exception.InvalidInputException;
// import com.example.bank.model.Account;
// import com.example.bank.model.OtpToken;
// import com.example.bank.repository.AccountRepository;
// import com.example.bank.repository.OtpTokenRepository;
// import com.example.bank.service.OtpService;
// import lombok.RequiredArgsConstructor;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.scheduling.annotation.Async;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import java.security.SecureRandom;
// import java.time.LocalDateTime;
// import java.util.Optional;

// @Service
// @RequiredArgsConstructor
// @Slf4j
// public class OtpServiceImpl implements OtpService {

//     private final OtpTokenRepository otpTokenRepository;
//     private final AccountRepository accountRepository;
//     private final PasswordEncoder passwordEncoder;
//     private final JavaMailSender mailSender;

//     private static final SecureRandom random = new SecureRandom();

//     @Override
//     @Transactional
//     public void generateAndSendOtp(String accountNumber) {
//         Account account = accountRepository.findByAccountNumber(accountNumber)
//                 .orElseThrow(() -> new InvalidInputException("Account not found"));

//         String otp = String.format("%06d", random.nextInt(1_000_000));

//         OtpToken token = new OtpToken(
//                 accountNumber,
//                 passwordEncoder.encode(otp),
//                 LocalDateTime.now().plusMinutes(5)
//         );

//         otpTokenRepository.save(token);
//         sendOtpEmail(account.getCustomer().getEmail(), otp);

//         log.info("OTP generated (DEV): {}", otp);
//     }

//     @Override
//     @Transactional
//     public boolean verifyOtp(String accountNumber, String otp) {
//         Optional<OtpToken> tokenOpt =
//                 otpTokenRepository.findLatest(accountNumber);

//         if (tokenOpt.isEmpty()) return false;

//         OtpToken token = tokenOpt.get();

//         if (token.isExpired()) return false;

//         if (!passwordEncoder.matches(otp, token.getOtpHash())) return false;

//         token.markUsed();
//         otpTokenRepository.save(token);
//         return true;
//     }

//     @Scheduled(fixedRate = 300000)
//     public void cleanupExpiredOtps() {
//         otpTokenRepository.deleteExpired(LocalDateTime.now());
//     }

//     @Async
//     void sendOtpEmail(String to, String otp) {
//         SimpleMailMessage msg = new SimpleMailMessage();
//         msg.setTo(to);
//         msg.setSubject("Apna Bank OTP");
//         msg.setText("Your OTP is: " + otp);
//         mailSender.send(msg);
//     }
// }



/////////
/// 
package com.example.bank.service.impl;

import com.example.bank.exception.InvalidInputException;
import com.example.bank.model.Account;
import com.example.bank.model.OtpToken;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.OtpTokenRepository;
import com.example.bank.service.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpServiceImpl implements OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    private static final SecureRandom random = new SecureRandom();

    @Override
    @Transactional
    public void generateAndSendOtp(String accountNumber) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new InvalidInputException("Account not found"));

        String otp = String.format("%06d", random.nextInt(1_000_000));

        OtpToken token = new OtpToken();
        token.setAccountNumber(accountNumber);
        token.setOtpHash(passwordEncoder.encode(otp));
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        token.setUsed(false);

        otpTokenRepository.save(token);

        sendOtpEmail(account.getCustomer().getEmail(), otp);

        log.info("OTP generated (DEV only): {}", otp);
    }

    @Override
    @Transactional
    public boolean verifyOtp(String accountNumber, String otp) {

        Optional<OtpToken> tokenOpt =
                otpTokenRepository.findTopByAccountNumberAndUsedFalseOrderByCreatedAtDesc(accountNumber);

        if (tokenOpt.isEmpty()) return false;

        OtpToken token = tokenOpt.get();

        if (token.isExpired()) return false;

        if (!passwordEncoder.matches(otp, token.getOtpHash())) return false;

        token.setUsed(true);
        otpTokenRepository.save(token);

        return true;
    }

    @Scheduled(fixedRate = 300000) // every 5 minutes
    @Transactional
    public void cleanupExpiredOtps() {
        List<OtpToken> expired = otpTokenRepository.findByExpiryTimeBefore(LocalDateTime.now());
        otpTokenRepository.deleteAll(expired);
    }

    @Async
    void sendOtpEmail(String to, String otp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Apna Bank OTP");
        msg.setText("Your OTP is: " + otp);
        mailSender.send(msg);
    }
}

