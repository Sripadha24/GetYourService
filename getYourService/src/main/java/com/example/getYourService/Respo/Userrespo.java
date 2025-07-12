package com.example.getYourService.Respo;


import com.example.getYourService.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface Userrespo extends JpaRepository<User,Integer> {
    Optional<User> findByEmail(String email);


}
