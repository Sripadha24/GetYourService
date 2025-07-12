package com.example.getYourService.service;

import com.example.getYourService.Respo.ReportRepository;
import com.example.getYourService.dto.ReportRequest;
import com.example.getYourService.model.Report;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final JavaMailSender mailSender;
    private final ReportRepository reportRepository;

    @Value("${admin.email}")
    private String adminEmail;

    public ReportService(JavaMailSender mailSender, ReportRepository reportRepository) {
        this.mailSender = mailSender;
        this.reportRepository = reportRepository;
    }

    public void submitReport(ReportRequest request) {
        if (request.getUser() == null || request.getMessage() == null) {
            throw new IllegalArgumentException("Invalid report request");
        }

        Report report = new Report();
        report.setUser(request.getUser());
        report.setMessage(request.getMessage());
        reportRepository.save(report);

        // Use user.getName() instead of request.getName()
        String userName = request.getUser().getFirstName();  // Assumes User has a getName() field

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(adminEmail);
        mail.setSubject("New Report from " + userName);
        mail.setText("Name: " + userName + "\n" +
                "User ID: " + request.getUser().getId() + "\n\n" +
                "Message:\n" + request.getMessage());

        mailSender.send(mail);
    }
    public List<Report> getAllreports(){
       return  reportRepository.findAll();

    }
}
