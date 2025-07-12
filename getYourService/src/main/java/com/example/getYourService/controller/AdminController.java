package com.example.getYourService.controller;


import com.example.getYourService.model.*;
import com.example.getYourService.service.*;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {



   @Autowired
   private AuthenticationService authenticationService;

   @Autowired
   private CategoryService categoryService;

   @Autowired
   private PostingSerivce postingSerivce;

   @Autowired
   private BookingService bookingService;

   @Autowired
   private ReviewService reviewService;

   @Autowired
   private ReportService reportService;

    @GetMapping("/admin")
    public ResponseEntity<String> adminOnly() {
        return ResponseEntity.ok("Hello from admin only url");
    }
    @GetMapping("/getallUser")
    public ResponseEntity<User> getUser(){
       return ResponseEntity.ok((User) authenticationService.getUsers());
    }
    @GetMapping("/getUser")
    public ResponseEntity<Optional<User>> getspecficuser(@RequestParam Integer id){
        return ResponseEntity.ok(authenticationService.getUser(id));
    }
    @DeleteMapping("/deleteUser")
    public ResponseEntity<String> deleteUser(@RequestParam Integer id){
        return ResponseEntity.ok(authenticationService.deleteUser(id));
    }
    @GetMapping("getallservices")
    public ResponseEntity<List<Services>> viewservices(){
        return ResponseEntity.ok(postingSerivce.viewAllservices());
    }
    @GetMapping("/getservice")
    public ResponseEntity<Optional<Services>> getService(@RequestParam Integer id){
        return ResponseEntity.ok(postingSerivce.getService(id));
    }
    @DeleteMapping("/deleteservice")
    public ResponseEntity<String> deleteService(@RequestParam Integer id){
        return ResponseEntity.ok(postingSerivce.delteservice(id));
    }
    @GetMapping("/getallbooking")
    public ResponseEntity<List<Booking>> getAllbooking(){
        return ResponseEntity.ok(bookingService.getAllBooking());
    }
    @DeleteMapping("/deletebooking")
    public ResponseEntity<String> delteBookong(@RequestParam Long id){
        return ResponseEntity.ok(bookingService.deleteAdminBooking(id));
    }
    @GetMapping("/getallreview")
    public ResponseEntity<List<Review>> getallreview(){
        return ResponseEntity.ok(reviewService.getAllReview());
    }
    @DeleteMapping("/deleteReview")
    public ResponseEntity<String> deleteReview(@RequestParam Long id){
        return ResponseEntity.ok(reviewService.deleteReview(id));
    }
    @GetMapping("/getallreports")
    public ResponseEntity<List<Report>> getallreport(){
        return ResponseEntity.ok(reportService.getAllreports());
    }
    @PostMapping("/postcategory")
    public ResponseEntity<Category> postCategory(@RequestBody Category category){
        return  ResponseEntity.ok(categoryService.postCategory(category));
    }
    @DeleteMapping("/deleteCategory")
    public ResponseEntity<String> deleteCategory(@RequestParam Integer id){
        return ResponseEntity.ok(categoryService.deleteCategory(id));
    }


    



}
