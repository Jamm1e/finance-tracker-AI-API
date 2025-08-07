package com.jammie.financetracker.controller;

import com.jammie.financetracker.model.Goal;
import com.jammie.financetracker.model.Transaction;
import com.jammie.financetracker.repository.GoalRepository;
import com.jammie.financetracker.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/insights")
public class InsightController {

    // This pulls in your existing database layers — like saying:
    //“Hey Spring, give me access to all saved transactions and goals.”
    
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private GoalRepository goalRepository;

    @GetMapping
    public List<String> getInsights() {
        List<String> insights = new ArrayList<>();

        // Goal progress insights
        for (Goal goal : goalRepository.findAll()) {
            double progress = (goal.getCurrentAmount() / goal.getTargetAmount()) * 100;
            if (progress == 100){
                String insight = String.format("You have reached your \"%s\" goal!", goal.getName());
                insights.add(insight);
            } else {
                String insight = String.format("You're %.0f%% of the way to your \"%s\" goal.", progress, goal.getName());
                insights.add(insight);
            }
            
        }

        // Spending insights
        double totalSpent = 0.0;
        Map<String, Double> categoryTotals = new HashMap<>();

        for (Transaction t : transactionRepository.findAll()) {
            totalSpent += t.getAmount();
            categoryTotals.put(t.getCategory(), categoryTotals.getOrDefault(t.getCategory(), 0.0) + t.getAmount());
        }

        insights.add("You've spent $" + String.format("%.2f", totalSpent) + " in total.");
        for (String category : categoryTotals.keySet()) {
            insights.add("You've spent $" + String.format("%.2f", categoryTotals.get(category)) + " on " + category + ".");
        }

        return insights;
    }
}
