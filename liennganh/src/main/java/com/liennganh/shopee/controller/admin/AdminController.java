package com.liennganh.shopee.controller.admin;

import com.liennganh.shopee.dto.response.AdminStatisticsDTO;
import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.service.admin.AdminService;
import com.liennganh.shopee.service.shop.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller dành cho Quản trị viên (Admin)
 * Cung cấp các API quản lý người dùng, người bán và xem thống
 * kê hệ thống
 * Tất cả endpoints chỉ dành cho role ADMIN
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final StatisticsService statisticsService;

    // ========== QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT) ==========

    /**
     * Lấy danh sách tất cả người dùng
     * Quyền hạn: ADMIN
     * 
     */
    @GetMapping("/users")
    public ApiResponse<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ApiResponse.success(users, "Lấy danh sách người dùng thành công");
    }

    /**
     * Xem chi tiết thông tin người dùng
     * Quyền hạn: ADMIN
     * 
     */
    @GetMapping("/users/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ApiResponse.success(user, "Lấy thông tin người dùng thành công");
    }

    /**
     * Khóa tài khoản người dùng
     * Quyền hạn: ADMIN
     * 
     */
    @PutMapping("/users/{id}/lock")
    public ApiResponse<User> lockUser(@PathVariable Long id) {
        User user = adminService.lockUser(id);
        return ApiResponse.success(user, "Khóa người dùng thành công");
    }

    /**
     * Mở khóa tài khoản người dùng
     * Quyền hạn: ADMIN
     * 
     */
    @PutMapping("/users/{id}/unlock")
    public ApiResponse<User> unlockUser(@PathVariable Long id) {
        User user = adminService.unlockUser(id);
        return ApiResponse.success(user, "Mở khóa người dùng thành công");
    }

    // ========== QUẢN LÝ NGƯỜI BÁN (SELLER MANAGEMENT) ==========

    /**
     * Lấy danh sách người bán đang chờ duyệt
     * Quyền hạn: ADMIN
     * 
     */
    @GetMapping("/sellers/pending")
    public ApiResponse<List<User>> getPendingSellers() {
        List<User> sellers = adminService.getPendingSellers();
        return ApiResponse.success(sellers, "Lấy danh sách người bán chờ duyệt thành công");
    }

    /**
     * Lấy danh sách tất cả người bán
     * Quyền hạn: ADMIN
     * 
     */
    @GetMapping("/sellers")
    public ApiResponse<List<User>> getAllSellers() {
        List<User> sellers = adminService.getAllSellers();
        return ApiResponse.success(sellers, "Lấy danh sách người bán thành công");
    }

    /**
     * Duyệt yêu cầu đăng ký người bán
     * Quyền hạn: ADMIN
     * 
     */
    @PutMapping("/sellers/{id}/approve")
    public ApiResponse<User> approveSeller(@PathVariable Long id) {
        User seller = adminService.approveSeller(id);
        return ApiResponse.success(seller, "Duyệt người bán thành công");
    }

    /**
     * Từ chối yêu cầu đăng ký người bán
     * Quyền hạn: ADMIN
     * 
     */
    @PutMapping("/sellers/{id}/reject")
    public ApiResponse<User> rejectSeller(@PathVariable Long id) {
        User seller = adminService.rejectSeller(id);
        return ApiResponse.success(seller, "Từ chối người bán thành công");
    }

    /**
     * Tạm khóa tài khoản người bán
     * Quyền hạn: ADMIN
     * 
     */
    @PutMapping("/sellers/{id}/suspend")
    public ApiResponse<User> suspendSeller(@PathVariable Long id) {
        User seller = adminService.suspendSeller(id);
        return ApiResponse.success(seller, "Tạm khóa người bán thành công");
    }

    // ========== THỐNG KÊ (STATISTICS) ==========

    /**
     * Xem thống kê tổng quan hệ thống
     * Bao gồm doanh thu, số lượng user, shop, đơn hàng...
     * Quyền hạn: ADMIN
     * 
     */
    @GetMapping("/statistics")
    public ApiResponse<AdminStatisticsDTO> getStatistics() {
        AdminStatisticsDTO stats = statisticsService.getAdminStatistics();
        return ApiResponse.success(stats, "Lấy thống kê hệ thống thành công");
    }
}
