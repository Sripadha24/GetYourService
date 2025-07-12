package com.example.getYourService.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Integer serviceId;
    private Integer customerId;
    private double customerLat;
    private double customerLong;
}

