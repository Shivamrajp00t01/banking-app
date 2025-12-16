package com.example.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private BigDecimal totalDeposits;
    private BigDecimal totalWithdrawals;
    private BigDecimal totalTransfersOut;
    private BigDecimal totalTransfersIn;
    private BigDecimal currentBalance;
    private Map<String, BigDecimal> categorySpending;
    private List<DailyBalance> dailyBalances;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyBalance {
        private String date;
        private BigDecimal balance;
    }
}