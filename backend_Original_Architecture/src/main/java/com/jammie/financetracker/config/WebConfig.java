package com.jammie.financetracker.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all endpoints
            .allowedOrigins("http://localhost:5173") // Allow your frontend's origin
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow all common HTTP methods
            .allowedHeaders("*"); // Allow all headers
    }
}