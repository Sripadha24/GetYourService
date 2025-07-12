package com.example.getYourService.service;


import com.example.getYourService.Respo.ServiceRespo;
import com.example.getYourService.dto.ServiceWithDistance;
import com.example.getYourService.model.Services;
import com.example.getYourService.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private ServiceRespo serviceRespo;

    public List<ServiceWithDistance> getAvailableServicesWithDistance(double customerLat, double customerLong) {
        List<Services> availableServices = serviceRespo.findByAvailabilityTrue();
        List<ServiceWithDistance> serviceWithDistances = new ArrayList<>();

        for (Services serviceP : availableServices) {
            User provider = serviceP.getUser();

            // Handle null cases gracefully
            Double providerLat = provider.getLatitude();
            Double providerLong = provider.getLongitude();

            if (providerLat != null && providerLong != null) {
                double distance = calculateDistance(customerLat, customerLong, providerLat, providerLong);
                serviceWithDistances.add(new ServiceWithDistance(serviceP, distance));
            } else {

                System.out.println("Skipping provider with missing coordinates: " + provider.getId());
            }
        }
        return serviceWithDistances;
    }

    private int calculateDistance(double lat1, double lon1, Double lat2, Double lon2) {
        final int R = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (int) ((int) R * c);
    }
    public String generateGoogleMapsUrl(double lat1, double lon1, double lat2, double lon2) {
        return String.format("https://www.google.com/maps/dir/?api=1&origin=%f,%f&destination=%f,%f",
                lat1, lon1, lat2, lon2);
    }

}



