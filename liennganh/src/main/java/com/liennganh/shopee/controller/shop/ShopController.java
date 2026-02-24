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
 * Controller quáº£n lÃ½ Shop (Cá»­a hÃ ng)
 * Cung cáº¥p API xem danh sÃ¡ch shop, chi tiáº¿t shop vÃ  xem shop cá»§a chÃ­nh
 * mÃ¬nh
 * (Ä‘á»‘i vá»›i seller)
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
     * Láº¥y danh sÃ¡ch táº¥t cáº£ cÃ¡c shop trÃªn há»‡ thá»‘ng
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping
    public ApiResponse<List<Shop>> getAllShops() {
        return ApiResponse.success(shopService.getAllShops(), "Láº¥y danh sÃ¡ch cá»­a hÃ ng thÃ nh cÃ´ng");
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
     * Xem thÃ´ng tin shop do user hiá»‡n táº¡i quáº£n lÃ½
     * Quyá»n háº¡n: SELLER, ADMIN
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
        return ApiResponse.success(shop, "Láº¥y thÃ´ng tin cá»­a hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * Xem chi tiáº¿t thÃ´ng tin cá»§a má»™t shop báº¥t ká»³
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/{id}")
    public ApiResponse<Shop> getShopById(@PathVariable Long id) {
        return ApiResponse.success(shopService.getShopById(id), "Láº¥y thÃ´ng tin cá»­a hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y userId cá»§a chá»§ shop (dÃ¹ng cho tÃ­nh nÄƒng Chat Ngay)
     */
    @GetMapping("/{id}/owner-id")
    public ApiResponse<Long> getShopOwnerId(@PathVariable Long id) {
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
        return ApiResponse.success(shop.getOwner().getId(), "Láº¥y owner ID thÃ nh cÃ´ng");
    }
}
