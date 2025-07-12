package com.example.getYourService.dto;

import com.example.getYourService.model.Services;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceWithDistance {
    private Services service;
    private double  distance;
}
