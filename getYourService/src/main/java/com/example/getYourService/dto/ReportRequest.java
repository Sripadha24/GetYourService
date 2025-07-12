package com.example.getYourService.dto;

import com.example.getYourService.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportRequest {
    private User user;
    private String message;




    // Getters and setters



}
