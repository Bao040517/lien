package com.liennganh.shopee.controller.auth;

import com.liennganh.shopee.dto.request.LoginRequest;
import com.liennganh.shopee.dto.request.RegisterRequest;
import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.LoginResponse;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.service.auth.AuthService;
import com.liennganh.shopee.service.auth.JwtService;
import com.liennganh.shopee.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xá»­ lÃ½ authentication (Ä‘Äƒng kÃ½, Ä‘Äƒng nháº­p)
 * Endpoints cÃ´ng khai, khÃ´ng cáº§n JWT token
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    /**
     * ÄÄƒng kÃ½ tÃ i khoáº£n USER (khÃ¡ch hÃ ng)
     */
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ApiResponse.success(user, "ÄÄƒng kÃ½ thÃ nh cÃ´ng");
    }

    /**
     * ÄÄƒng nháº­p
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.success(response, "ÄÄƒng nháº­p thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y thÃ´ng tin user hiá»‡n táº¡i (tá»« JWT token)
     * KhÃ´ng cáº§n truyá»n userId - tá»± láº¥y tá»« token
     */
    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        Long userId = SecurityUtils.getCurrentUserId(jwtService);
        UserResponse user = authService.getUserResponseById(userId);
        return ApiResponse.success(user, "Láº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }
}

