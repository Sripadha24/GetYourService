package com.example.getYourService.controller;


import com.example.getYourService.Respo.Userrespo;
import com.example.getYourService.model.AuthenticationResponse;
import com.example.getYourService.model.User;
import com.example.getYourService.service.AuthenticationService;
import com.example.getYourService.service.RedisOtpService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authService;

    @Autowired
    private RedisOtpService redisOtpService;

    @Autowired
    private Userrespo respo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody User request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody User request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody User request) {
        authService.sendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (email == null || otp == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }

        User user = respo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String storedOtp = redisOtpService.getOtp(email);

        if (storedOtp == null) {
            return ResponseEntity.badRequest().body("OTP expired or not found");
        }

        if (!storedOtp.equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        // OTP is valid — update password
        user.setPassword(passwordEncoder.encode(newPassword));
        respo.save(user);

        // Remove OTP from Redis after successful use
        redisOtpService.deleteOtp(email);

        return ResponseEntity.ok("Password reset successful");
    }
}
