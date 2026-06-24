package com.umojatech.researchiq.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import com.umojatech.researchiq.repository.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

    @Override
    public void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
                                 @NonNull FilterChain filterChain) throws ServletException, IOException {

      String authHeader = request.getHeader("Authorization");
      if (authHeader == null) {
        filterChain.doFilter(request, response);
        return;
      }
      if(!authHeader.startsWith("Bearer ")){
        filterChain.doFilter(request, response);
        return;
      }

      if (SecurityContextHolder.getContext().getAuthentication() == null) {
        try {
          String token = authHeader.substring(7);
          String username = jwtUtil.extractUsername(token);
          if (username == null) {
            filterChain.doFilter(request, response);
            return;
          }

          var userDetails = userRepository.findByEmail(username)
                  .map(CustomUserDetails::new)
                  .orElse(null);
          if (userDetails == null) {
            filterChain.doFilter(request, response);
            return;
          }

          if (!jwtUtil.isTokenValid(token, userDetails)) {
            filterChain.doFilter(request, response);
            return;
          }

          UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                  userDetails,
                  null,
                  userDetails.getAuthorities()
          );
          SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception ex) {
          SecurityContextHolder.clearContext();
        }
      }
      filterChain.doFilter(request, response);
    }
}
