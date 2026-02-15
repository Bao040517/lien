package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Voucher;
import com.liennganh.shopee.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;

    @GetMapping
    public ApiResponse<java.util.List<Voucher>> getAllVouchers() {
        return ApiResponse.success(voucherService.getAllVouchers(), "Vouchers retrieved successfully");
    }

    @PostMapping
    public ApiResponse<Voucher> createVoucher(@RequestBody Voucher voucher) {
        return ApiResponse.success(voucherService.createVoucher(voucher), "Voucher created successfully");
    }

    @PostMapping("/apply")
    public ApiResponse<java.math.BigDecimal> applyVoucher(@RequestParam String code,
            @RequestParam java.math.BigDecimal orderValue,
            @RequestParam(required = false) Long shopId) {
        try {
            java.math.BigDecimal discount = voucherService.applyVoucher(code, orderValue, shopId);
            com.liennganh.shopee.model.Voucher voucher = voucherService.getVoucherByCode(code)
                    .orElseThrow(() -> new RuntimeException("Voucher not found"));
            return ApiResponse.success(discount,
                    "Success: Disc=" + discount + ", Ord=" + orderValue + ", Rate=" + voucher.getDiscountValue()
                            + ", Type=" + voucher.getDiscountType());
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    @Autowired
    private com.liennganh.shopee.repository.UserRepository userRepository;

    @GetMapping("/my-shop")
    public ApiResponse<java.util.List<Voucher>> getMyShopVouchers(@RequestParam Long userId) {
        com.liennganh.shopee.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ApiResponse.success(voucherService.getShopVouchers(user),
                "Shop vouchers retrieved");
    }

    @GetMapping("/shop/{shopId}")
    public ApiResponse<java.util.List<Voucher>> getShopVouchers(@PathVariable Long shopId) {
        return ApiResponse.success(voucherService.getShopVouchersByShopId(shopId), "Shop vouchers retrieved");
    }

    @PostMapping("/my-shop")
    public ApiResponse<Voucher> createShopVoucher(@RequestBody Voucher voucher, @RequestParam Long userId) {
        com.liennganh.shopee.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ApiResponse.success(voucherService.createShopVoucher(voucher, user),
                "Shop voucher created");
    }

    @DeleteMapping("/my-shop/{id}")
    public ApiResponse<Void> deleteShopVoucher(@PathVariable Long id, @RequestParam Long userId) {
        com.liennganh.shopee.model.User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        voucherService.deleteShopVoucher(id, user);
        return ApiResponse.success(null, "Shop voucher deleted");
    }
}
