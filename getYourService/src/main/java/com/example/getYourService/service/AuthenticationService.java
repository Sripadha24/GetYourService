package com.example.getYourService.service;


import com.example.getYourService.Respo.TokenRespo;
import com.example.getYourService.Respo.Userrespo;
import com.example.getYourService.model.AuthenticationResponse;
import com.example.getYourService.model.Token;
import com.example.getYourService.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private RedisOtpService redisOtpService;

    private final Userrespo respo;
    private final PasswordEncoder passwordEncoder;
    private EmailService emailService;
    private final JwtService jwtService;
    private final TokenRespo tokenRespo;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(Userrespo respo, PasswordEncoder passwordEncoder,
                                 JwtService jwtService, TokenRespo tokenRespo,
                                 AuthenticationManager authenticationManager,EmailService emailService,RedisOtpService redisOtpService) {
        this.respo = respo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenRespo = tokenRespo;

        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.redisOtpService = redisOtpService;
    }

    public AuthenticationResponse register(User request) {
        if (respo.findByEmail(request.getEmail().toLowerCase()).isPresent()) {
            return new AuthenticationResponse(null, "User already exists");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail().toLowerCase());
        user.setAddress(request.getAddress());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user = respo.save(user);

        String jwt = jwtService.generateToken(user);
        saveUserToken(jwt, user);

        return new AuthenticationResponse(jwt, "User registration was successful");
    }
    public String updateUser(Integer id,String firstName,String lastName,String phone,String address){
        User user = respo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setAddress(address);


        respo.save(user);


        return "updated";
    }
    public Optional<User> getUser(Integer id){
        return  respo.findById(id);
    }

    public AuthenticationResponse authenticate(User request) {
        String email = request.getEmail().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = respo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));


        if (request.getRole() != null && !request.getRole().equals(user.getRole())) {
            throw new UsernameNotFoundException("Invalid role for this user");
        }

        String jwt = jwtService.generateToken(user);
        revokeAllTokenByUser(user);
        saveUserToken(jwt, user);

        return new AuthenticationResponse(jwt, "User login was successful");
    }


    private void revokeAllTokenByUser(User user) {
        List<Token> validTokens = tokenRespo.findAllTokensByUser(user.getId());
        validTokens.forEach(t -> t.setLoggedOut(true));
        tokenRespo.saveAll(validTokens);
    }

    private void saveUserToken(String jwt, User user) {
        Token token = new Token();
        token.setToken(jwt);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRespo.save(token);
    }
    public void sendOtp(String email) {
        User user = respo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String otp = String.valueOf((int)((Math.random() * 900000) + 100000));
        redisOtpService.saveOtp(email, otp); // Store in Redis

        emailService.sendOtpEmail(email, otp);
    }

    public List<User> getUsers(){
        return  respo.findAll();
    }

    public String deleteUser(Integer id){
        respo.deleteById(id);
        return "deleted";
    }

}
