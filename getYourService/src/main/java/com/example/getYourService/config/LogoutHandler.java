package com.example.getYourService.config;


import com.example.getYourService.Respo.TokenRespo;
import com.example.getYourService.model.Token;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;

@Configuration
public class LogoutHandler implements org.springframework.security.web.authentication.logout.LogoutHandler{
    @Autowired
    private TokenRespo tokenRespo;

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        String authHeader = request.getHeader("Authorization");

        if(authHeader == null||!authHeader.startsWith("Bearer ")){
            return;
        }

        String token = authHeader.substring(7);
        Token storedToken = tokenRespo.findByToken(token).orElse(null);

        if(storedToken != null) {
            storedToken.setLoggedOut(true);
            tokenRespo.save(storedToken);
        }
    }
}
