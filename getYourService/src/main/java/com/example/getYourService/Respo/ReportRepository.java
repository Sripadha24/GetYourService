package com.example.getYourService.Respo;


import com.example.getYourService.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}

