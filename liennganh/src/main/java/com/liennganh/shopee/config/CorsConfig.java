package com.liennganh.shopee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Cấu hình CORS (Cross-Origin Resource Sharing)
 * Cho phép frontend (React/Vue/Angular) gọi API từ domain khác
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Cho phép các nguồn (origins) truy cập
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173", // Vite default port (React/Vue)
                "http://localhost:3000", // React default port (backup)
                "http://127.0.0.1:5173"));

        // Cho phép tất cả các HTTP methods (GET, POST, PUT, DELETE...)
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Cho phép tất cả các headers
        config.setAllowedHeaders(Arrays.asList("*"));

        // Cho phép gửi credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // Thời gian cache preflight request (giây)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
