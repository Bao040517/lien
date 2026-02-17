package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.Voucher;
import com.liennganh.shopee.service.shop.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * Controller quản lý Mã giảm giá (Voucher)
 * Hỗ trợ voucher hệ thống và voucher của shop, cũng như chức năng áp dụng
 * voucher
 */
@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {
    @Autowired
    private VoucherService voucherService;
    @Autowired
    private com.liennganh.shopee.repository.user.UserRepository userRepository;

    /**
     * Lấy danh sách tất cả voucher hệ thống đang có hiệu lực
     * Quyền hạn: Public
     * 
     */
    @GetMapping
    public ApiResponse<java.util.List<Voucher>> getAllVouchers() {
        return ApiResponse.success(voucherService.getAllVouchers(), "Lấy danh sách voucher thành công");
    }

    /**
     * Tạo voucher mới cho hệ thống
     * Quyền hạn: ADMIN
     * 
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<Voucher> createVoucher(@RequestBody Voucher voucher) {
        return ApiResponse.success(voucherService.createVoucher(voucher), "Tạo voucher thành công");
    }

    /**
     * Áp dụng mã voucher vào đơn hàng để tính toán mức giảm giá
     * Quyền hạn: USER, SELLER
     * 
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping("/apply")
    public ApiResponse<java.math.BigDecimal> applyVoucher(@RequestParam String code,
            @RequestParam java.math.BigDecimal orderValue,
            @RequestParam(required = false) Long shopId) {
        try {
            java.math.BigDecimal discount = voucherService.applyVoucher(code, orderValue, shopId);
            com.liennganh.shopee.entity.Voucher voucher = voucherService.getVoucherByCode(code)
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));
            return ApiResponse.success(discount,
                    "Thành công: Giảm=" + discount + ", Giá trị=" + orderValue + ", Mức giảm="
                            + voucher.getDiscountValue()
                            + ", Loại=" + voucher.getDiscountType());
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * Lấy danh sách voucher do shop của user hiện tại tạo ra
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @GetMapping("/my-shop")
    public ApiResponse<java.util.List<Voucher>> getMyShopVouchers(@RequestParam Long userId) {
        com.liennganh.shopee.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ApiResponse.success(voucherService.getShopVouchers(user),
                "Lấy danh sách voucher của shop thành công");
    }

    /**
     * Lấy danh sách voucher của một shop bất kỳ hiển thị cho người mua
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/shop/{shopId}")
    public ApiResponse<java.util.List<Voucher>> getShopVouchers(@PathVariable Long shopId) {
        return ApiResponse.success(voucherService.getShopVouchersByShopId(shopId),
                "Lấy danh sách voucher của shop thành công");
    }

    /**
     * Tạo voucher mới cho shop
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PostMapping("/my-shop")
    public ApiResponse<Voucher> createShopVoucher(@RequestBody Voucher voucher, @RequestParam Long userId) {
        com.liennganh.shopee.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ApiResponse.success(voucherService.createShopVoucher(voucher, user),
                "Tạo voucher cho shop thành công");
    }

    /**
     * Xóa voucher của shop
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @DeleteMapping("/my-shop/{id}")
    public ApiResponse<Void> deleteShopVoucher(@PathVariable Long id, @RequestParam Long userId) {
        com.liennganh.shopee.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        voucherService.deleteShopVoucher(id, user);
        return ApiResponse.success(null, "Xóa voucher của shop thành công");
    }
}
