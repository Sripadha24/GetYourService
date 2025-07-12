package com.example.getYourService.Respo;


import com.example.getYourService.model.Services;
import com.example.getYourService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRespo extends JpaRepository<Services,Integer> {
    List<Services> findByAvailabilityTrue();
    Optional<Services> findByUser(User user);
    List<Services> findAllByUser(User user);

}
