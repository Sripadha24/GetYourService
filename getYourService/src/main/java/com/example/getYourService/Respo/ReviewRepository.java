package com.example.getYourService.Respo;

import com.example.getYourService.model.Review;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByBooking_Id(Long bookingId);
    @Query("SELECT r FROM Review r WHERE r.booking.provider.id = :providerId")
    List<Review> findAllByProviderId(@Param("providerId") Integer providerId);

}

