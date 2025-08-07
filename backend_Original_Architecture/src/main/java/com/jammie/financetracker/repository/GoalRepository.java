package com.jammie.financetracker.repository;

import com.jammie.financetracker.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

//Spring Boot uses interfaces to auto-handle database operations like save, delete, and findAll.
// This gives you CRUD (Create, Read, Update, Delete) operations — without writing SQL.

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByUserId(String userId);

}