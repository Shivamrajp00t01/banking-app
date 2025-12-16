package com.example.bank.service.impl;

import com.example.bank.exception.InvalidInputException;
import com.example.bank.model.Account;
import com.example.bank.model.Transaction;
import com.example.bank.repository.AccountRepository;
import com.example.bank.repository.TransactionRepository;
import com.example.bank.service.PdfService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public ByteArrayOutputStream generateStatement(
            String accountNumber,
            LocalDateTime start,
            LocalDateTime end) {

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new InvalidInputException("Account not found"));

        List<Transaction> txs =
                transactionRepository.findByAccountAndDateRange(
                        accountNumber, start, end);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (Document doc =
                     new Document(new PdfDocument(new PdfWriter(baos)))) {

            doc.add(new Paragraph("APNA BANK STATEMENT").setBold());

            Table table = new Table(UnitValue.createPercentArray(5))
                    .useAllAvailableWidth();

            table.addHeaderCell("Date");
            table.addHeaderCell("Type");
            table.addHeaderCell("Amount");
            table.addHeaderCell("Balance");
            table.addHeaderCell("Description");

            for (Transaction tx : txs) {
                table.addCell(tx.getTransactionTime().toString());
                table.addCell(tx.getType().name());
                table.addCell(tx.getAmount().toString());
                table.addCell(tx.getBalanceAfter().toString());
                table.addCell(tx.getDescription());
            }

            doc.add(table);
        } catch (Exception e) {
            throw new InvalidInputException("PDF generation failed");
        }

        return baos;
    }
}
