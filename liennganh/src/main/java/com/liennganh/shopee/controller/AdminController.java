package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.AdminStatisticsDTO;
import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.service.AdminService;
import com.liennganh.shopee.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final StatisticsService statisticsService;

    // User Management
    @GetMapping("/users")
    public ApiResponse<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ApiResponse.success(users, "Lấy danh sách người dùng thành công");
    }

    @GetMapping("/users/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ApiResponse.success(user, "Lấy thông tin người dùng thành công");
    }

    @PutMapping("/users/{id}/lock")
    public ApiResponse<User> lockUser(@PathVariable Long id) {
        User user = adminService.lockUser(id);
        return ApiResponse.success(user, "Khóa người dùng thành công");
    }

    @PutMapping("/users/{id}/unlock")
    public ApiResponse<User> unlockUser(@PathVariable Long id) {
        User user = adminService.unlockUser(id);
        return ApiResponse.success(user, "Mở khóa người dùng thành công");
    }

    // Seller Management
    @GetMapping("/sellers/pending")
    public ApiResponse<List<User>> getPendingSellers() {
        List<User> sellers = adminService.getPendingSellers();
        return ApiResponse.success(sellers, "Lấy danh sách người bán chờ duyệt thành công");
    }

    @GetMapping("/sellers")
    public ApiResponse<List<User>> getAllSellers() {
        List<User> sellers = adminService.getAllSellers();
        return ApiResponse.success(sellers, "Lấy danh sách người bán thành công");
    }

    @PutMapping("/sellers/{id}/approve")
    public ApiResponse<User> approveSeller(@PathVariable Long id) {
        User seller = adminService.approveSeller(id);
        return ApiResponse.success(seller, "Duyệt người bán thành công");
    }

    @PutMapping("/sellers/{id}/reject")
    public ApiResponse<User> rejectSeller(@PathVariable Long id) {
        User seller = adminService.rejectSeller(id);
        return ApiResponse.success(seller, "Từ chối người bán thành công");
    }

    @PutMapping("/sellers/{id}/suspend")
    public ApiResponse<User> suspendSeller(@PathVariable Long id) {
        User seller = adminService.suspendSeller(id);
        return ApiResponse.success(seller, "Tạm khóa người bán thành công");
    }

    // Statistics
    @GetMapping("/statistics")
    public ApiResponse<AdminStatisticsDTO> getStatistics() {
        AdminStatisticsDTO stats = statisticsService.getAdminStatistics();
        return ApiResponse.success(stats, "Lấy thống kê hệ thống thành công");
    }
}
