package com.liennganh.shopee.controller.user;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Address;
import com.liennganh.shopee.service.user.AddressService;
import com.liennganh.shopee.service.auth.JwtService;
import com.liennganh.shopee.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Controller quáº£n lÃ½ Ä‘á»‹a chá»‰ giao hÃ ng
 * User/Seller chá»‰ quáº£n lÃ½ Ä‘á»‹a chá»‰ cá»§a mÃ¬nh, Admin quáº£n lÃ½ Ä‘Æ°á»£c táº¥t cáº£
 */
@RestController
@RequestMapping("/api/addresses")
@PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
public class AddressController {
    @Autowired
    private AddressService addressService;
    @Autowired
    private JwtService jwtService;

    /**
     * Láº¥y táº¥t cáº£ Ä‘á»‹a chá»‰ trong há»‡ thá»‘ng
     * Quyá»n háº¡n: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<Address>> getAllAddresses() {
        return ApiResponse.success(addressService.getAllAddresses(), "Láº¥y danh sÃ¡ch táº¥t cáº£ Ä‘á»‹a chá»‰ thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch Ä‘á»‹a chá»‰ cá»§a má»™t user
     * User/Seller chá»‰ xem Ä‘Æ°á»£c Ä‘á»‹a chá»‰ cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
     */
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Address>> getUserAddresses(@PathVariable Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(addressService.getUserAddresses(userId),
                "Láº¥y danh sÃ¡ch Ä‘á»‹a chá»‰ cá»§a ngÆ°á»i dÃ¹ng thÃ nh cÃ´ng");
    }

    /**
     * ThÃªm Ä‘á»‹a chá»‰ má»›i
     * User/Seller chá»‰ thÃªm cho mÃ¬nh
     */
    @PostMapping("/user/{userId}")
    public ApiResponse<Address> addAddress(@PathVariable Long userId, @RequestBody Address address) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(addressService.addAddress(userId, address), "ThÃªm Ä‘á»‹a chá»‰ thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t thÃ´ng tin Ä‘á»‹a chá»‰
     * User/Seller chá»‰ sá»­a Ä‘á»‹a chá»‰ cá»§a mÃ¬nh
     */
    @PutMapping("/user/{userId}/{addressId}")
    public ApiResponse<Address> updateAddress(@PathVariable Long userId, @PathVariable Long addressId,
            @RequestBody Address address) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(addressService.updateAddress(userId, addressId, address),
                "Cáº­p nháº­t Ä‘á»‹a chá»‰ thÃ nh cÃ´ng");
    }

    /**
     * XÃ³a Ä‘á»‹a chá»‰
     * User/Seller chá»‰ xÃ³a Ä‘á»‹a chá»‰ cá»§a mÃ¬nh
     */
    @DeleteMapping("/user/{userId}/{addressId}")
    public ApiResponse<String> deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        addressService.deleteAddress(userId, addressId);
        return ApiResponse.success("XÃ³a Ä‘á»‹a chá»‰ thÃ nh cÃ´ng", "ThÃ nh cÃ´ng");
    }
}

