package com.example.getYourService.controller;


import com.example.getYourService.dto.ProviderBookingDetails;
import com.example.getYourService.model.Category;
import com.example.getYourService.model.Review;
import com.example.getYourService.model.Services;
import com.example.getYourService.model.User;
import com.example.getYourService.service.CurrentId;
import com.example.getYourService.service.PostingSerivce;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/serviceprovider")
public class
ServiceController {


    @Autowired
    private PostingSerivce postingser;

    @Autowired
    private CurrentId currentId;

    @PostMapping("/post")
    public ResponseEntity<Services> postService(@RequestBody Services request) {

        Integer userId = Math.toIntExact(currentId.getCurrentUserId());
        Category category = request.getCategory();
        String description = request.getDescription();

        return ResponseEntity.ok(postingser.postService(userId, category, description));
    }
    @PutMapping("/update")
    public ResponseEntity<Services> update(@RequestBody Services serviceP){
        Integer userId = currentId.getCurrentUserId();
        boolean available = serviceP.isAvailability();

        return ResponseEntity.ok(postingser.update(userId,available));
    }
    @PostMapping("/booking/{bookingId}/accept")
    public ResponseEntity<String> acceptBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(postingser.acceptBooking(bookingId));
    }

    @PostMapping("/booking/{bookingId}/reject")
    public ResponseEntity<String> rejectBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(postingser.rejectBooking(bookingId));
    }
    @GetMapping("/booking/history")
    public ResponseEntity<List<ProviderBookingDetails>> getProviderBookingHistory() {
        Integer providerId = currentId.getCurrentUserId();
        return ResponseEntity.ok(postingser.getProviderBookings(providerId));
    }
    @GetMapping("/provider/directions/{bookingId}")
    public ResponseEntity<Map<String, String>> getDirections(@PathVariable Long bookingId) {
        String url = postingser.getDirectionsUrl(bookingId);
        return ResponseEntity.ok(Map.of("directionsUrl", url));
    }
    @GetMapping("/services")
    public ResponseEntity<List<Services>> viewServices(){
        Integer Userid = currentId.getCurrentUserId();
        return ResponseEntity.ok(postingser.findallservices(Userid));
    }
    @PostMapping("/booking/{bookingId}/completed")
    public ResponseEntity<String> compltedBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(postingser.completedBooking(bookingId));
    }
    @DeleteMapping("/deleteService")
    public ResponseEntity<String> deleteService(@RequestParam Integer id){
        Integer Userid  = currentId.getCurrentUserId();
        return ResponseEntity.ok(postingser.deleteService(id,Userid));
    }
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getProviderReviews() {
        Integer proid =currentId.getCurrentUserId();
        return ResponseEntity.ok(postingser.getReviewsForProvider(proid));
    }






}

