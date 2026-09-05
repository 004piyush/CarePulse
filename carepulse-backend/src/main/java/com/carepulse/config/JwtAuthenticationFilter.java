package com.carepulse.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        log.info(">>> JWT Filter triggered for: {} {}", request.getMethod(), request.getRequestURI());

        try {
            String jwt = parseJwt(request);
            log.info(">>> Parsed JWT: {}", jwt != null ? jwt.substring(0, 20) + "..." : "NULL");

            if (jwt != null) {
                boolean valid = jwtUtils.validateJwtToken(jwt);
                log.info(">>> Token valid: {}", valid);

                if (valid) {
                    String username = jwtUtils.getUsernameFromJwtToken(jwt);
                    log.info(">>> Username from token: {}", username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    log.info(">>> UserDetails loaded: {} with authorities: {}",
                            userDetails.getUsername(), userDetails.getAuthorities());

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.info(">>> Authentication set in SecurityContext!");
                }
            } else {
                log.warn(">>> No JWT token found in Authorization header");
            }
        } catch (Exception e) {
            log.error(">>> JWT Filter Exception: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        log.info(">>> Authorization header: {}", headerAuth);
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
