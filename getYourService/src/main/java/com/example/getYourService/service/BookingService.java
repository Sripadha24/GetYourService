package com.example.getYourService.service;


import com.example.getYourService.Respo.BookingRepository;
import com.example.getYourService.Respo.ServiceRespo;
import com.example.getYourService.Respo.Userrespo;
import com.example.getYourService.dto.BookingDetails;
import com.example.getYourService.dto.BookingRequest;
import com.example.getYourService.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final Userrespo userRepository;
    private final ServiceRespo serviceRepository;

    public String bookService(BookingRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Services service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setService(service);
        booking.setCustomerLat(request.getCustomerLat());
        booking.setCustomerLong(request.getCustomerLong());
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookedAt(LocalDateTime.now());

        bookingRepository.save(booking);

        return "Service booked successfully.";
    }

    public List<BookingDetails> getCustomerBookings(Integer customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Booking> bookings = bookingRepository.findByCustomer(customer);

        return bookings.stream().map(booking -> {
            Services service = booking.getService();
            User provider = service.getUser();

            BookingDetails details = new BookingDetails();
            details.setServiceName(service.getCategory().getName());
            details.setProviderName(provider.getFirstName());
            details.setProviderPhone(provider.getPhone());
            details.setProviderEmail(provider.getEmail());
            details.setStatus(booking.getStatus());
            if (booking.getStatus() == BookingStatus.ACCEPTED) {
                details.setDirectionsUrl(generateGoogleMapsUrl(
                        provider.getLatitude(), provider.getLongitude(),
                        booking.getCustomerLat(), booking.getCustomerLong()));
            }
            return details;
        }).toList();
    }
    public String deleteBooking(Long id,Integer userId){
        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
         bookingRepository.findById(id)
                .map(booking -> booking.getCustomer().getId().equals(userId))
                .orElse(false);
        return "deleted";
    }

    private String generateGoogleMapsUrl(double lat1, double lon1, double lat2, double lon2) {
        return String.format("https://www.google.com/maps/dir/?api=1&origin=%f,%f&destination=%f,%f",
                lat1, lon1, lat2, lon2);
    }
    public List<Booking> getAllBooking(){
        return bookingRepository.findAll();
    }
    public  String deleteAdminBooking(Long id){
        bookingRepository.deleteById(id);
        return "deleted";
    }
}

