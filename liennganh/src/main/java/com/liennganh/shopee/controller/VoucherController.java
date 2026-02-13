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
            @RequestParam java.math.BigDecimal orderValue) {
        try {
            return ApiResponse.success(voucherService.applyVoucher(code, orderValue), "Voucher applied successfully");
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }
}
