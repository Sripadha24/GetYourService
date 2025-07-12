package com.example.getYourService.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public  class LocationRequest {
    public double customerLat;
    public double customerLong;
}
