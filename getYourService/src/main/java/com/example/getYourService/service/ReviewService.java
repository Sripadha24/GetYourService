package com.example.getYourService.service;

import com.example.getYourService.Respo.BookingRepository;
import com.example.getYourService.Respo.ReviewRepository;
import com.example.getYourService.dto.ReviewRequest;
import com.example.getYourService.model.Booking;
import com.example.getYourService.model.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final BookingRepository bookingRepo;

    public String submitReview(Long bookingId, ReviewRequest request) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));


        if (reviewRepo.findByBooking_Id(bookingId).isPresent()) {
            throw new RuntimeException("Review already submitted for this booking");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setBooking(booking);

        reviewRepo.save(review);

        return "Review submitted successfully";
    }
    public List<Review> getAllReview(){
        return reviewRepo.findAll();
    }
    public String deleteReview(Long id){
        reviewRepo.deleteById(id);
        return "deleted";
    }
    public List<Review> getAllReviewByBookingId(Long id) {
        return reviewRepo.findAll()
                .stream()
                .filter(review -> review.getBooking().getId().equals(id))
                .collect(Collectors.toList());
    }

}

