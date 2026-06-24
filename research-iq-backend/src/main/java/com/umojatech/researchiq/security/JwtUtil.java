package com.umojatech.researchiq.security;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Base64;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.function.Function;
import io.jsonwebtoken.Claims;

@Component
public class JwtUtil {

  private final JwtProperties jwtProperties;
    private final Key signInKey;

    public JwtUtil(JwtProperties jwtProperties) {
            this.jwtProperties = jwtProperties;
            this.signInKey = buildSignInKey(jwtProperties.getSecretKey());
    }

  public String extractUsername(String token) {
      return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
      final Claims claims = extractAllClaims(token);
      return claimsResolver.apply(claims);
  }

  public String generateToken(UserDetails userDetails) {
      return generateToken(new HashMap<>(), userDetails);
  }

  public String generateToken(
          Map<String, Object> extraClaims,
          UserDetails userDetails
  ) {
      return Jwts.builder()
              .setClaims(extraClaims)
              .setSubject(userDetails.getUsername())
              .setIssuer(jwtProperties.getIssuer())
              .setIssuedAt(new Date(System.currentTimeMillis()))
              .setExpiration(new Date(System.currentTimeMillis() + jwtProperties.getExpirationMs()))
              .signWith(signInKey, SignatureAlgorithm.HS256)
              .compact();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
      final String username = extractUsername(token);
      return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
      return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
      return extractClaim(token, Claims::getExpiration);
  }

  private Claims extractAllClaims(String token) {
      return Jwts
              .parserBuilder()
              .setSigningKey(signInKey)
              .build()
              .parseClaimsJws(token)
              .getBody();
  }

  private Key buildSignInKey(String encodedSecretKey) {
      try {
          byte[] keyBytes = Base64.getDecoder().decode(encodedSecretKey);
          return Keys.hmacShaKeyFor(keyBytes);
      } catch (IllegalArgumentException ex) {
          throw new IllegalStateException(
                  "JWT secret must be a Base64-encoded value with at least 32 decoded bytes",
                  ex
          );
      }
  }
}
