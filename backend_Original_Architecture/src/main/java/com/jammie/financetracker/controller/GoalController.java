package com.jammie.financetracker.controller;

import com.jammie.financetracker.model.Goal;
import com.jammie.financetracker.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Says this class handles API routes
@RequestMapping("/goals")
public class GoalController {

    @Autowired
    private GoalRepository goalRepository;

    @GetMapping
    public List<Goal> getUserGoals(@RequestParam String userId) {
        return goalRepository.findByUserId(userId);
    }

    @PostMapping
    public Goal createGoal(@RequestBody Goal goal) {
        if (goal.getCurrentAmount() == null) {
            goal.setCurrentAmount(0.0);
        }

        if (goal.getUserId() == null || goal.getUserId().isEmpty()) {
            throw new IllegalArgumentException("userId is required");
        }

        return goalRepository.save(goal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        goalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable Long id, @RequestBody Goal updatedG) {
        return goalRepository.findById(id)
                .map(g -> {
                    g.setName(updatedG.getName());
                    g.setCurrentAmount(updatedG.getCurrentAmount());
                    g.setTargetAmount(updatedG.getTargetAmount());
                    g.setUserId(updatedG.getUserId());

                    Goal savedGoal = goalRepository.save(g);
                    return ResponseEntity.ok(savedGoal);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
