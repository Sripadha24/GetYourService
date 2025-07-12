package com.example.getYourService.controller;


import com.example.getYourService.dto.*;
import com.example.getYourService.model.Review;
import com.example.getYourService.model.Services;
import com.example.getYourService.model.User;
import com.example.getYourService.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor

public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private  ReportService reportService;

    @Autowired
    private PostingSerivce services;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private CurrentId currentId;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private final BookingService bookingService;





    @PostMapping("/services")
    public ResponseEntity<List<ServiceWithDistance>> getServicesWithDistance(
            @RequestBody LocationRequest location) {

        return ResponseEntity.ok(customerService.getAvailableServicesWithDistance(location.customerLat, location.customerLong));
    }

    @GetMapping("/getprovider")
    public ResponseEntity<User> getProvider(@RequestParam Integer id){
            return ResponseEntity.ok(services.findProvider(id));
    }
    @GetMapping("/getservice")
    public ResponseEntity<Optional<Services>> getservices(@RequestParam Integer id){
        return ResponseEntity.ok(services.findService(id));
    }
    @PostMapping("/{bookingId}/review")
    public ResponseEntity<String> submitReview(
            @PathVariable Long bookingId,
            @RequestBody ReviewRequest reviewRequest) {
        return ResponseEntity.ok(reviewService.submitReview(bookingId, reviewRequest));
    }
    @PutMapping("/updateUser")
    public ResponseEntity<String> updateUser(@RequestBody User user){
        Integer id = currentId.getCurrentUserId();

        String phone = user.getPhone();
        String address = user.getAddress();
        String firstName = user.getFirstName();
        String lastname = user.getLastName();

        return ResponseEntity.ok(authenticationService.updateUser(id,firstName,lastname,phone,address));
    }


    @PostMapping("/bookings")
    public ResponseEntity<String> bookService(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.bookService(request));
    }

    @GetMapping("bookings/history")
    public ResponseEntity<List<BookingDetails>> getBookingHistory(@RequestParam Integer customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }
    @DeleteMapping("bookings/deletebooking")
    public ResponseEntity<String> deleteBooking(@RequestParam Long id){
        Integer currentUserId = currentId.getCurrentUserId();
        return ResponseEntity.ok(bookingService.deleteBooking(id,currentUserId));
    }
    @GetMapping("/booking/{id}")
    public ResponseEntity<List<Review>> getReviewsByBooking(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getAllReviewByBookingId(id));
    }
    @PostMapping("/submit")
    public ResponseEntity<String> submitReport(@RequestBody ReportRequest request) {
        reportService.submitReport(request);
        return ResponseEntity.ok("Report submitted successfully");
    }








}

