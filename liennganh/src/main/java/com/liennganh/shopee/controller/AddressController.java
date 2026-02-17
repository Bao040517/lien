package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Address;
import com.liennganh.shopee.service.user.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

/**
 * Controller quản lý địa chỉ giao hàng của người dùng
 * Cung cấp API thêm, sửa, xóa và xem danh sách địa chỉ
 * Yêu cầu đăng nhập để sử dụng
 */
@RestController
@RequestMapping("/api/addresses")
@PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
public class AddressController {
    @Autowired
    private AddressService addressService;

    /**
     * Lấy tất cả địa chỉ trong hệ thống (thường dùng cho Admin hoặc debug)
     * Quyền hạn: USER, SELLER, ADMIN (cần tinh chỉnh permission sau nếu cần thiết)
     * 
     */
    @GetMapping
    public ApiResponse<List<Address>> getAllAddresses() {
        return ApiResponse.success(addressService.getAllAddresses(), "Lấy danh sách tất cả địa chỉ thành công");
    }

    /**
     * Lấy danh sách địa chỉ của một user cụ thể
     * Quyền hạn: USER (chính chủ), ADMIN
     * 
     */
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Address>> getUserAddresses(@PathVariable Long userId) {
        return ApiResponse.success(addressService.getUserAddresses(userId),
                "Lấy danh sách địa chỉ của người dùng thành công");
    }

    /**
     * Thêm địa chỉ mới cho user
     * Quyền hạn: USER (chính chủ)
     * 
     */
    @PostMapping("/user/{userId}")
    public ApiResponse<Address> addAddress(@PathVariable Long userId, @RequestBody Address address) {
        return ApiResponse.success(addressService.addAddress(userId, address), "Thêm địa chỉ thành công");
    }

    /**
     * Cập nhật thông tin địa chỉ
     * Quyền hạn: USER (chính chủ)
     * 
     */
    @PutMapping("/user/{userId}/{addressId}")
    public ApiResponse<Address> updateAddress(@PathVariable Long userId, @PathVariable Long addressId,
            @RequestBody Address address) {
        return ApiResponse.success(addressService.updateAddress(userId, addressId, address),
                "Cập nhật địa chỉ thành công");
    }

    /**
     * Xóa địa chỉ
     * Quyền hạn: USER (chính chủ)
     * 
     */
    @DeleteMapping("/user/{userId}/{addressId}")
    public ApiResponse<String> deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        addressService.deleteAddress(userId, addressId);
        return ApiResponse.success("Xóa địa chỉ thành công", "Thành công");
    }
}
