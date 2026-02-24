package com.liennganh.shopee.util;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.service.auth.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Utility class hỗ trợ bảo mật
 * Dùng để lấy thông tin user hiện tại từ JWT token (SecurityContext)
 * và kiểm tra quyền sở hữu tài nguyên
 */
public class SecurityUtils {

    /**
     * Lấy username của user đang đăng nhập từ SecurityContext
     */
    public static String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        return auth.getPrincipal().toString();
    }

    /**
     * Lấy userId của user đang đăng nhập từ JWT token trong request header
     */
    public static Long getCurrentUserId(JwtService jwtService) {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        HttpServletRequest request = attrs.getRequest();
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        String jwt = authHeader.substring(7);
        return jwtService.extractUserId(jwt);
    }

    /**
     * Kiểm tra user hiện tại có phải ADMIN không
     */
    public static boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            return false;
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    /**
     * Kiểm tra quyền sở hữu: User/Seller chỉ xem được dữ liệu của chính mình.
     * Admin xem được tất cả.
     *
     * @param resourceOwnerId ID của user sở hữu tài nguyên
     * @param currentUserId   ID của user hiện tại (từ JWT)
     * @throws AppException UNAUTHORIZED nếu không có quyền
     */
    public static void validateOwnership(Long resourceOwnerId, Long currentUserId) {
        if (isAdmin())
            return; // Admin xem được tất cả
        if (!resourceOwnerId.equals(currentUserId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }
}
