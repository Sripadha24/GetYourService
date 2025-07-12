package com.example.getYourService.model;



import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User customer;

    @ManyToOne
    private Services service;

    private double customerLat;
    private double customerLong;
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review;



    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    private LocalDateTime bookedAt = LocalDateTime.now();
}

