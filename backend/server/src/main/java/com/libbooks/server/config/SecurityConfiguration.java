package com.libbooks.server.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        // Configure endpoint protection
//        http
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers( // Require authentication for any endpoint under these secured paths
//                                "/api/books/secure/**",
//                                "/api/reviews/secure/**",
//                                "/api/messages/secure/**",
//                                "/api/admin/secure/**"
//                        ).authenticated()
//                        .anyRequest().permitAll() // Allow all other endpoints to be accessed without authentication
//                )
//                .oauth2Login(Customizer.withDefaults()) // Enable OAuth2 login (e.g. using Google, Okta, etc.)
//                .oauth2ResourceServer(oath2 -> oath2.jwt(Customizer.withDefaults())) // Configure JWT support for OAuth2 resource server
//                .cors(Customizer.withDefaults()) // Enable CORS (Cross-Origin Resource Sharing)
//                .csrf(AbstractHttpConfigurer::disable); // Disable CSRF protection (typically needed for stateless REST APIs)
//
//        // Set content negotiation strategy to use headers (e.g. Accept: application/json)
//        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());
//
//        // Force a non-empty response body for 401's to make the response friendly
//        // Customize 401 Unauthorized responses with Okta's default formatting
//        Okta.configureResourceServer401ResponseBody(http);
//
//        // Return the configured SecurityFilterChain
//        return http.build();

        // No authentication and authorization
        http
                // Allow ALL requests without authentication
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                // Disable CSRF (safe for APIs)
                .csrf(AbstractHttpConfigurer::disable)
                // Disable CORS if you're not dealing with cross-origin issues (optional)
                .cors(Customizer.withDefaults());

        // No login, no JWT, no OAuth2 — it's completely open

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
