package com.socialmedia.user.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println(
                "================================="
        );

        System.out.println(
                "JWT FILTER REQUEST: "
                + request.getMethod()
                + " "
                + request.getRequestURI()
        );

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "AUTH HEADER: "
                + (authHeader != null
                    ? "TOKEN FOUND"
                    : "NO TOKEN")
        );


        // ==========================================
        // NO TOKEN
        // ==========================================

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        // ==========================================
        // GET TOKEN
        // ==========================================

        String token =
                authHeader.substring(7);


        try {

            String email =
                    jwtService.extractEmail(token);

            System.out.println(
                    "JWT EMAIL: " + email
            );


            // ======================================
            // SET AUTHENTICATION
            // ======================================

            if (email != null &&
                    SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(
                                    new SimpleGrantedAuthority(
                                        "ROLE_USER"
                                    )
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );

                System.out.println(
                        "JWT AUTHENTICATION SUCCESS"
                );
            }

        } catch (Exception e) {

            /*
             * IMPORTANT:
             * Don't directly return 403 here.
             * Continue the filter chain.
             */

            System.out.println(
                    "JWT VALIDATION ERROR: "
                    + e.getClass().getSimpleName()
                    + " - "
                    + e.getMessage()
            );
        }


        // ==========================================
        // CONTINUE
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}