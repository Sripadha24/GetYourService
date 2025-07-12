package com.example.getYourService.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @Column(columnDefinition = "TEXT")
    private String message;

    private String createdAt;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
