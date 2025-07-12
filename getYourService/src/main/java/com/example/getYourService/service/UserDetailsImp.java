package com.example.getYourService.service;


import com.example.getYourService.Respo.Userrespo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsImp implements UserDetailsService {
    private final Userrespo respo;

    public UserDetailsImp(Userrespo respo) {
        this.respo = respo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        return respo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not Found"));
    }
}
