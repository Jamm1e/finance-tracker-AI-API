package com.jammie.financetracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity // tells Spring: "Hey, this is a database table"
@Data
@NoArgsConstructor 
@AllArgsConstructor //@Data, @NoArgsConstructor, etc. are from Lombok — they auto-generate your getters, setters, and constructors
public class Transaction {
    
    // @Id + @GeneratedValue = auto-increment primary key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String description;
    private Double amount;
    private LocalDate date;
    private String category;
}
