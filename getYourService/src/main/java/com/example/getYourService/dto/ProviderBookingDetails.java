package com.example.getYourService.dto;

import com.example.getYourService.model.BookingStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProviderBookingDetails {
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String serviceCategory;
    private String serviceDescription;
    private BookingStatus status;
    private LocalDateTime bookedAt;
}

