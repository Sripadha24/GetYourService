package com.example.getYourService.service;


import com.example.getYourService.Respo.TokenRespo;
import com.example.getYourService.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    private final String SECRET_KEY = "bc0c23f9a10eb1e89824186287d8d20cfdc33bcd93c3cc4d92c9d404714686da";
    private final TokenRespo tokenRespo;

    public JwtService(TokenRespo tokenRespo) {
        this.tokenRespo = tokenRespo;
    }
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }


    public boolean isValid(String token, UserDetails user) {
        String username = extractUsername(token);

        boolean validToken = tokenRespo
                .findByToken(token)
                .map(t -> !t.isLoggedOut())
                .orElse(false);

        return (username.equals(user.getUsername())) && !isTokenExpired(token) && validToken;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigninKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    public Integer extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("userId", Integer.class);
    }




    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("userId", user .getId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 24*60*60*1000))
                .signWith(getSigninKey())
                .compact();
    }


    private Key getSigninKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }


}
