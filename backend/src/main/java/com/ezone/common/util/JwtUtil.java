package com.ezone.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

@Component
public class JwtUtil {
    private final SecretKey key = Jwts.SIG.HS256.key().build();
    private final long expirationTime = 86400000; // 1 ngày

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();
    }

    public Claims extractClaims(String token) {
        try {
            return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        } catch (JwtException e) {
            return null;
        }
    }

    public boolean validateToken(String token, String username) {
        try {
            Claims claims = extractClaims(token);
            if (claims == null) {
                return false;
            }
            return claims.getSubject().equals(username) && !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}