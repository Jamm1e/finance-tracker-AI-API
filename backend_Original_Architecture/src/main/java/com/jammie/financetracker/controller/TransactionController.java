package com.jammie.financetracker.controller;

// This is where the API endpoints live — like /transactions

import com.jammie.financetracker.model.Transaction;
import com.jammie.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController // Says this class handles API routes
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired // Automatically injects the repository so you don’t need to manually create it
    private TransactionRepository transactionRepository;

    // @GetMapping // Returns all transactions
    // public List<Transaction> getAllTransactions() {
    //     return transactionRepository.findAll();
    // }

    @GetMapping
    public List<Transaction> getUserTransactions(@RequestParam String userId) {
        return transactionRepository.findByUserId(userId);
    }

    @PostMapping // Adds New Transaction
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        if (transaction.getUserId() == null || transaction.getUserId().isEmpty()) {
            throw new IllegalArgumentException("userId is required");
        }

        transaction.setDate(LocalDate.now());
        return transactionRepository.save(transaction);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable Long id, @RequestBody Transaction updatedTx) {
        return transactionRepository.findById(id)
                .map(tx -> {
                    tx.setAmount(updatedTx.getAmount());
                    tx.setCategory(updatedTx.getCategory());
                    tx.setDescription(updatedTx.getDescription());
                    tx.setDate(updatedTx.getDate());
                    tx.setUserId(updatedTx.getUserId());

                    Transaction savedTx = transactionRepository.save(tx);
                    return ResponseEntity.ok(savedTx);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
