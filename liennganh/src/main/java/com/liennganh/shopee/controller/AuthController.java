package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.request.LoginRequest;
import com.liennganh.shopee.dto.request.RegisterRequest;
import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        return ApiResponse.success(user, "Đăng ký thành công");
    }

    @PostMapping("/register-seller")
    public ApiResponse<UserResponse> registerSeller(@RequestBody RegisterRequest request) {
        UserResponse user = authService.registerSeller(request);
        return ApiResponse.success(user, "Đăng ký người bán thành công. Vui lòng chờ admin duyệt.");
    }

    @PostMapping("/login")
    public ApiResponse<UserResponse> login(@RequestBody LoginRequest request) {
        UserResponse user = authService.login(request);
        return ApiResponse.success(user, "Đăng nhập thành công");
    }

    @GetMapping("/me")
    public ApiResponse<UserResponse> getCurrentUser(@RequestParam Long userId) {
        // TODO: Get userId from session/token instead of request param
        UserResponse user = authService.getCurrentUser(userId);
        return ApiResponse.success(user, "Lấy thông tin người dùng thành công");
    }
}
