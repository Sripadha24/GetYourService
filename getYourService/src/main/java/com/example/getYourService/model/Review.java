package com.example.getYourService.model;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;

    private String comment;

    @OneToOne
    @JoinColumn(name = "booking_id", unique = true)
    private Booking booking;

    private LocalDateTime createdAt = LocalDateTime.now();
}

