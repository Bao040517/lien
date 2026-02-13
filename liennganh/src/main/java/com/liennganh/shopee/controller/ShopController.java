package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Shop;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.service.ShopService;
import com.liennganh.shopee.repository.UserRepository;
import com.liennganh.shopee.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    @Autowired
    private ShopService shopService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ShopRepository shopRepository;

    @GetMapping
    public ApiResponse<List<Shop>> getAllShops() {
        return ApiResponse.success(shopService.getAllShops(), "Shops retrieved successfully");
    }

    @GetMapping("/my-shop")
    public ApiResponse<Shop> getMyShop(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.USER_NOT_FOUND));
        Shop shop = shopRepository.findByOwner(user)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
        return ApiResponse.success(shop, "Shop retrieved successfully");
    }
}
