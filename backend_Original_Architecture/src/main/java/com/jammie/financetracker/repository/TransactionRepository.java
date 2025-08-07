package com.jammie.financetracker.repository;

import com.jammie.financetracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

//Spring Boot uses interfaces to auto-handle database operations like save, delete, and findAll.
// This gives you CRUD (Create, Read, Update, Delete) operations — without writing SQL.

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserId(String userId);
}
