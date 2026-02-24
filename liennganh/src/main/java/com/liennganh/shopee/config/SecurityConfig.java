package com.liennganh.shopee.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuration cho Spring Security
 * Định nghĩa các rules bảo mật, filter chain và encoder
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Bật tính năng @PreAuthorize trên method
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF vì sử dụng JWT (stateless authentication)
                .csrf(csrf -> csrf.disable())

                // Phân quyền cho các request URL
                .authorizeHttpRequests(auth -> auth
                        // Các endpoints Public - Ai cũng truy cập được
                        .requestMatchers(
                                "/api/auth/**", // Đăng ký, đăng nhập
                                "/api/files/**", // Xem/tải file ảnh
                                "/api/products/**", // Xem danh sách sản phẩm
                                "/api/categories/**", // Xem danh mục
                                "/api/reviews/**", // Xem đánh giá
                                "/seed-db/**", // Cho phép truy cập seeder không cần login
                                "/uploads/**" // Cho phép tải ảnh công khai
                        ).permitAll()

                        // Các requests còn lại bắt buộc phải đăng nhập (có token hợp lệ)
                        .anyRequest().authenticated())

                // Không lưu session (Stateless)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Thêm JWT Filter vào trước UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bean cung cấp PasswordEncoder (BCrypt)
     * Dùng để mã hóa mật khẩu trước khi lưu xuống DB và kiểm tra khi đăng nhập
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
