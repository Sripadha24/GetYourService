package com.example.getYourService.dto;

import com.example.getYourService.model.BookingStatus;
import lombok.Data;

@Data
public class BookingDetails {
    private String serviceName;
    private String providerName;
    private String providerPhone;
    private String providerEmail;
    private BookingStatus status;
    private String directionsUrl;
}

