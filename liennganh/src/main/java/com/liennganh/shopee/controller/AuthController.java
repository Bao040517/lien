package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.request.LoginRequest;
import com.liennganh.shopee.dto.request.RegisterRequest;
import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.LoginResponse;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý authentication (đăng ký, đăng nhập)
 * Endpoints công khai, không cần JWT token
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Đăng ký tài khoản USER (khách hàng)
     * 
     */
    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ApiResponse.success(user, "Đăng ký thành công");
    }

    /**
     * Đăng ký tài khoản SELLER (người bán)
     * Cần chờ admin duyệt trước khi có thể sử dụng
     * 
     */
    @PostMapping("/register-seller")
    public ApiResponse<UserResponse> registerSeller(@RequestBody RegisterRequest request) {
        UserResponse user = authService.registerSeller(request);
        return ApiResponse.success(user, "Đăng ký người bán thành công. Vui lòng chờ admin duyệt.");
    }

    /**
     * Đăng nhập
     * 
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.success(response, "Đăng nhập thành công");
    }

    /**
     * Lấy thông tin user hiện tại
     * TODO: Sẽ lấy từ JWT token thay vì request param
     * 
     */
    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser(@RequestParam Long userId) {
        UserResponse user = authService.getUserResponseById(userId);
        return ApiResponse.success(user, "Lấy thông tin người dùng thành công");
    }
}
