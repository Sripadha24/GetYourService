package com.example.getYourService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisOtpService {

    private final StringRedisTemplate redisTemplate;

    @Autowired
    public RedisOtpService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveOtp(String email, String otp) {
        redisTemplate.opsForValue().set(getOtpKey(email), otp, 2, TimeUnit.MINUTES);
    }

    public String getOtp(String email) {
        return redisTemplate.opsForValue().get(getOtpKey(email));
    }

    public void deleteOtp(String email) {
        redisTemplate.delete(getOtpKey(email));
    }

    private String getOtpKey(String email) {
        return "otp:" + email;
    }
}
