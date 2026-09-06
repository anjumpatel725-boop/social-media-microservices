package com.socialmedia.user.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            // ==========================================
            // CSRF
            // ==========================================
            .csrf(csrf -> csrf.disable())

            // ==========================================
            // SESSION
            // ==========================================
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // ==========================================
            // AUTHORIZATION
            // ==========================================
            .authorizeHttpRequests(auth -> auth

                // CORS preflight
                .requestMatchers(
                    org.springframework.http.HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Register
                .requestMatchers(
                    "/users/register"
                ).permitAll()

                // Login
                .requestMatchers(
                    "/users/login"
                ).permitAll()

                // Follow
                .requestMatchers(
                    "/users/*/follow"
                ).permitAll()

                // Following check
                .requestMatchers(
                    "/users/*/following"
                ).permitAll()

                // Followers count
                .requestMatchers(
                    "/users/*/followers/count"
                ).permitAll()

                // Following count
                .requestMatchers(
                    "/users/*/following/count"
                ).permitAll()

                // Other user APIs
                .requestMatchers(
                    "/users/**"
                ).permitAll()

                // Actuator
                .requestMatchers(
                    "/actuator/**"
                ).permitAll()

                // Everything else
                .anyRequest().authenticated()
            )

            // ==========================================
            // JWT FILTER
            // ==========================================
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // ================================================
    // PASSWORD ENCODER
    // ================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
