package com.liennganh.shopee.controller;

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
 * Controller quản lý địa chỉ giao hàng
 * User/Seller chỉ quản lý địa chỉ của mình, Admin quản lý được tất cả
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
     * Lấy tất cả địa chỉ trong hệ thống
     * Quyền hạn: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<Address>> getAllAddresses() {
        return ApiResponse.success(addressService.getAllAddresses(), "Lấy danh sách tất cả địa chỉ thành công");
    }

    /**
     * Lấy danh sách địa chỉ của một user
     * User/Seller chỉ xem được địa chỉ của mình, Admin xem được tất cả
     */
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Address>> getUserAddresses(@PathVariable Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(addressService.getUserAddresses(userId),
                "Lấy danh sách địa chỉ của người dùng thành công");
    }

    /**
     * Thêm địa chỉ mới
     * User/Seller chỉ thêm cho mình
     */
    @PostMapping("/user/{userId}")
    public ApiResponse<Address> addAddress(@PathVariable Long userId, @RequestBody Address address) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(addressService.addAddress(userId, address), "Thêm địa chỉ thành công");
    }

    /**
     * Cập nhật thông tin địa chỉ
     * User/Seller chỉ sửa địa chỉ của mình
     */
    @PutMapping("/user/{userId}/{addressId}")
    public ApiResponse<Address> updateAddress(@PathVariable Long userId, @PathVariable Long addressId,
            @RequestBody Address address) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(addressService.updateAddress(userId, addressId, address),
                "Cập nhật địa chỉ thành công");
    }

    /**
     * Xóa địa chỉ
     * User/Seller chỉ xóa địa chỉ của mình
     */
    @DeleteMapping("/user/{userId}/{addressId}")
    public ApiResponse<String> deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        addressService.deleteAddress(userId, addressId);
        return ApiResponse.success("Xóa địa chỉ thành công", "Thành công");
    }
}
