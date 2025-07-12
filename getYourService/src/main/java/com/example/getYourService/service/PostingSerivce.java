package com.example.getYourService.service;

import com.example.getYourService.Respo.BookingRepository;
import com.example.getYourService.Respo.ReviewRepository;
import com.example.getYourService.Respo.ServiceRespo;
import com.example.getYourService.Respo.Userrespo;
import com.example.getYourService.dto.ProviderBookingDetails;
import com.example.getYourService.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostingSerivce {
    @Autowired
    private ServiceRespo serviceRespo;
    @Autowired
    private final ReviewRepository reviewRepository;



    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private Userrespo userrespo;

    public PostingSerivce(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Services postService(Integer userId, Category category, String description){
        User user = userrespo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Services service = new Services();
        service.setCategory(category);
        service.setAvailability(false);
        service.setUser(user);
        return serviceRespo.save(service);
    }

    public Services update(Integer userId,boolean value){
        User user = userrespo.findById(userId)
                .orElseThrow(()-> new RuntimeException("User not found"));
        Services serviceP = serviceRespo.findByUser(user)
                .orElseThrow(()-> new RuntimeException("User not found"));
        serviceP.setAvailability(value);
        return serviceRespo.save(serviceP);


    }
    public User findProvider(Integer id){

        Services serviceP = serviceRespo.findById(id)
                .orElseThrow(()-> new RuntimeException("User not found"));
        return serviceP.getUser();


    }
    public Optional<Services> findService(Integer id){
        return serviceRespo.findById(id);
    }
    public String getDirectionsUrl(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Provider details
        User provider = booking.getService().getUser();
        double providerLat = provider.getLatitude();
        double providerLong = provider.getLongitude();

        // Customer location from booking
        double customerLat = booking.getCustomerLat();
        double customerLong = booking.getCustomerLong();

        return generateGoogleMapsUrl(providerLat, providerLong, customerLat, customerLong);
    }

    private String generateGoogleMapsUrl(double lat1, double lon1, double lat2, double lon2) {
        return String.format(
                "https://www.google.com/maps/dir/?api=1&origin=%f,%f&destination=%f,%f",
                lat1, lon1, lat2, lon2
        );
    }
    public List<ProviderBookingDetails> getProviderBookings(Integer providerId) {
        User provider = userrespo.findById(providerId)
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        List<Booking> bookings = bookingRepository.findAll()
                .stream()
                .filter(b -> b.getService().getUser().getId().equals(providerId))
                .toList();

        return bookings.stream().map(booking -> {
            ProviderBookingDetails dto = new ProviderBookingDetails();
            dto.setCustomerName(booking.getCustomer().getFirstName());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
            dto.setCustomerPhone(booking.getCustomer().getPhone());
            dto.setServiceCategory(booking.getService().getCategory().getName());
            dto.setServiceDescription(booking.getService().getDescription());
            dto.setStatus(booking.getStatus());
            dto.setBookedAt(booking.getBookedAt());
            return dto;
        }).toList();
    }


    public String acceptBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            return "Booking has already been " + booking.getStatus();
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        bookingRepository.save(booking);

        return "Booking accepted successfully.";
    }

    public String rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            return "Booking has already been " + booking.getStatus();
        }

        booking.setStatus(BookingStatus.REJECTED);
        bookingRepository.save(booking);

        return "Booking rejected.";
    }
    public  List<Services>  findallservices(Integer id){
       User user = userrespo.findById(id)
               .orElseThrow(() -> new RuntimeException("user  not found"));
       return serviceRespo.findAllByUser(user);
    }
    public String completedBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));



        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        return "Booking completed.";
    }
    public String deleteService(Integer id,Integer userId){

        serviceRespo.findById(id)
                .map(services -> services.getUser().getId().equals(userId))
                .orElse(false);
        return "deleted";
    }



    public List<Review> getReviewsForProvider(Integer providerId) {
        return reviewRepository.findAllByProviderId(providerId);
    }
    public List<Services> viewAllservices(){
        return serviceRespo.findAll();
    }
    public Optional<Services> getService(Integer id){
        return serviceRespo.findById(id);
    }
    public String delteservice(Integer id){
        serviceRespo.deleteById(id);
        return "deleted";
    }




}
