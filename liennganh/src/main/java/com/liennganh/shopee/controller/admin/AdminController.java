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
 * Controller dÃ nh cho Quáº£n trá»‹ viÃªn (Admin)
 * Cung cáº¥p cÃ¡c API quáº£n lÃ½ ngÆ°á»i dÃ¹ng, ngÆ°á»i bÃ¡n vÃ  xem thá»‘ng
 * kÃª há»‡ thá»‘ng
 * Táº¥t cáº£ endpoints chá»‰ dÃ nh cho role ADMIN
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final StatisticsService statisticsService;

    // ========== QUáº¢N LÃ NGÆ¯á»œI DÃ™NG (USER MANAGEMENT) ==========

    /**
     * Láº¥y danh sÃ¡ch táº¥t cáº£ ngÆ°á»i dÃ¹ng
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @GetMapping("/users")
    public ApiResponse<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ApiResponse.success(users, "Láº¥y danh sÃ¡ch ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }

    /**
     * Xem chi tiáº¿t thÃ´ng tin ngÆ°á»i dÃ¹ng
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @GetMapping("/users/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        User user = adminService.getUserById(id);
        return ApiResponse.success(user, "Láº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }

    /**
     * KhÃ³a tÃ i khoáº£n ngÆ°á»i dÃ¹ng
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PutMapping("/users/{id}/lock")
    public ApiResponse<User> lockUser(@PathVariable Long id) {
        User user = adminService.lockUser(id);
        return ApiResponse.success(user, "KhÃ³a ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }

    /**
     * Má»Ÿ khÃ³a tÃ i khoáº£n ngÆ°á»i dÃ¹ng
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PutMapping("/users/{id}/unlock")
    public ApiResponse<User> unlockUser(@PathVariable Long id) {
        User user = adminService.unlockUser(id);
        return ApiResponse.success(user, "Má»Ÿ khÃ³a ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }

    // ========== QUáº¢N LÃ NGÆ¯á»œI BÃN (SELLER MANAGEMENT) ==========

    /**
     * Láº¥y danh sÃ¡ch ngÆ°á»i bÃ¡n Ä‘ang chá» duyá»‡t
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @GetMapping("/sellers/pending")
    public ApiResponse<List<User>> getPendingSellers() {
        List<User> sellers = adminService.getPendingSellers();
        return ApiResponse.success(sellers, "Láº¥y danh sÃ¡ch ngÆ°á»i bÃ¡n chá» duyá»‡t thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch táº¥t cáº£ ngÆ°á»i bÃ¡n
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @GetMapping("/sellers")
    public ApiResponse<List<User>> getAllSellers() {
        List<User> sellers = adminService.getAllSellers();
        return ApiResponse.success(sellers, "Láº¥y danh sÃ¡ch ngÆ°á»i bÃ¡n thÃ nh cÃ´ng");
    }

    /**
     * Duyá»‡t yÃªu cáº§u Ä‘Äƒng kÃ½ ngÆ°á»i bÃ¡n
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PutMapping("/sellers/{id}/approve")
    public ApiResponse<User> approveSeller(@PathVariable Long id) {
        User seller = adminService.approveSeller(id);
        return ApiResponse.success(seller, "Duyá»‡t ngÆ°á»i bÃ¡n thÃ nh cÃ´ng");
    }

    /**
     * Tá»« chá»‘i yÃªu cáº§u Ä‘Äƒng kÃ½ ngÆ°á»i bÃ¡n
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PutMapping("/sellers/{id}/reject")
    public ApiResponse<User> rejectSeller(@PathVariable Long id) {
        User seller = adminService.rejectSeller(id);
        return ApiResponse.success(seller, "Tá»« chá»‘i ngÆ°á»i bÃ¡n thÃ nh cÃ´ng");
    }

    /**
     * Táº¡m khÃ³a tÃ i khoáº£n ngÆ°á»i bÃ¡n
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PutMapping("/sellers/{id}/suspend")
    public ApiResponse<User> suspendSeller(@PathVariable Long id) {
        User seller = adminService.suspendSeller(id);
        return ApiResponse.success(seller, "Táº¡m khÃ³a ngÆ°á»i bÃ¡n thÃ nh cÃ´ng");
    }

    // ========== THá»NG KÃŠ (STATISTICS) ==========

    /**
     * Xem thá»‘ng kÃª tá»•ng quan há»‡ thá»‘ng
     * Bao gá»“m doanh thu, sá»‘ lÆ°á»£ng user, shop, Ä‘Æ¡n hÃ ng...
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @GetMapping("/statistics")
    public ApiResponse<AdminStatisticsDTO> getStatistics() {
        AdminStatisticsDTO stats = statisticsService.getAdminStatistics();
        return ApiResponse.success(stats, "Láº¥y thá»‘ng kÃª há»‡ thá»‘ng thÃ nh cÃ´ng");
    }
}
