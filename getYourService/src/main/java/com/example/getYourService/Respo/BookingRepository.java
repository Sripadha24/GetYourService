package com.example.getYourService.Respo;

import com.example.getYourService.model.Booking;
import com.example.getYourService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomer(User customer);
}

