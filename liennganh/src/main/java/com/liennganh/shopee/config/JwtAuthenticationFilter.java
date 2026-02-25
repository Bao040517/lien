package com.liennganh.shopee.config;

import com.liennganh.shopee.service.auth.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filter xác thực JWT cho mỗi request
 * Filter này sẽ chạy trước các Controller để kiểm tra xem request có token hợp
 * lệ không
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        // Lấy header Authorization từ request
        final String authHeader = request.getHeader("Authorization");

        // Kiểm tra xem header có tồn tại và bắt đầu bằng "Bearer " không
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Nếu không, cho qua filter tiếp theo (để SecurityConfig xử lý
                                                     // public url)
            return;
        }

        try {
            // Lấy token (bỏ phần "Bearer ")
            final String jwt = authHeader.substring(7);

            // Extract username và role từ token
            final String username = jwtService.extractUsername(jwt);
            final String role = jwtService.extractRole(jwt);

            // Nếu lấy được username và chưa được authenticate trong SecurityContext
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Kiểm tra token có hợp lệ không (hết hạn chưa, đúng user không)
                if (jwtService.isTokenValid(jwt, username)) {
                    // Tạo Authority (Role) từ token
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                    // Tạo đối tượng Authentication
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username,
                            null, // Kh�ng c?n credentials (pwd) v� d� x�c th?c b?ng token
                            Collections.singletonList(authority));

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Lưu thông tin authentication vào SecurityContext để Spring Security biết user
                    // d� dang nh?p
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    log.debug("�� x�c th?c user '{}' v?i role '{}'", username, role);
                }
            }
        } catch (Exception e) {
            log.error("Lỗi xác thực user: {}", e.getMessage());
        }

        // Chuyển tiếp request cho filter tiếp theo
        filterChain.doFilter(request, response);
    }
}
