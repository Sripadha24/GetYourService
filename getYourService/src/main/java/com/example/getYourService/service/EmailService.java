package com.example.getYourService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Your OTP for Password Reset";
        String body = "Hello,\n\nYour OTP for password reset is: " + otp +
                "\n\nThis OTP will expire in 10 minutes.\n\n\n\nchesukunte chesuko lekaapothe migay.\n\n- Abdul(vp) pvt ltd";

        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(new String(to));
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        }catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to send email: " + e.getMessage());
        }


        // Replace with a valid from address


    }
}
