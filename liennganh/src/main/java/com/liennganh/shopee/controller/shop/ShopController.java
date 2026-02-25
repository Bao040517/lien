package com.liennganh.shopee.controller.shop;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Shop;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.service.shop.ShopService;
import com.liennganh.shopee.repository.user.UserRepository;
import com.liennganh.shopee.repository.shop.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

/**
 * Controller quản lý Shop (Cửa hàng)
 * Cung cấp API xem danh sách shop, chi tiết shop và xem shop của chính
 * mÃ¬nh
 * (đối với seller)
 */
@RestController
@RequestMapping("/api/shops")
public class ShopController {
    @Autowired
    private ShopService shopService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShopRepository shopRepository;

    /**
     * Lấy danh sách tất cả các shop trên hệ thống
     * Quyền hạn: Public
     * 
     */
    @GetMapping
    public ApiResponse<List<Shop>> getAllShops() {
        return ApiResponse.success(shopService.getAllShops(), "Lấy danh sách cửa hàng thành công");
    }

    /**
     * Tìm kiếm Shop theo tên
     * Quyền hạn: Public
     */
    @GetMapping("/search")
    public ApiResponse<List<Shop>> searchShops(@RequestParam String keyword) {
        return ApiResponse.success(shopService.searchByName(keyword), "Tìm kiếm shop thành công");
    }

    /**
     * Xem thông tin shop do user hiện tại quản lý
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @GetMapping("/my-shop")
    public ApiResponse<Shop> getMyShop(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.USER_NOT_FOUND));
        Shop shop = shopRepository.findByOwner(user)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
        return ApiResponse.success(shop, "Lấy thông tin cửa hàng thành công");
    }

    /**
     * Xem chi tiết thông tin của một shop bất kỳ
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/{id}")
    public ApiResponse<Shop> getShopById(@PathVariable Long id) {
        return ApiResponse.success(shopService.getShopById(id), "Lấy thông tin cửa hàng thành công");
    }

    /**
     * Lấy userId của chủ shop (dùng cho tính năng Chat Ngay)
     */
    @GetMapping("/{id}/owner-id")
    public ApiResponse<Long> getShopOwnerId(@PathVariable Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
        return ApiResponse.success(shop.getOwner().getId(), "Lấy owner ID thành công");
    }
}
