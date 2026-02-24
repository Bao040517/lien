package com.liennganh.shopee.controller.voucher;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.Voucher;
import com.liennganh.shopee.service.shop.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * Controller quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Voucher)
 * Há»— trá»£ voucher há»‡ thá»‘ng vÃ  voucher cá»§a shop, cÅ©ng nhÆ° chá»©c nÄƒng Ã¡p dá»¥ng
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
     * Láº¥y danh sÃ¡ch táº¥t cáº£ voucher há»‡ thá»‘ng Ä‘ang cÃ³ hiá»‡u lá»±c
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping
    public ApiResponse<java.util.List<Voucher>> getAllVouchers() {
        return ApiResponse.success(voucherService.getAllVouchers(), "Láº¥y danh sÃ¡ch voucher thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o voucher má»›i cho há»‡ thá»‘ng
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<Voucher> createVoucher(@RequestBody Voucher voucher) {
        return ApiResponse.success(voucherService.createVoucher(voucher), "Táº¡o voucher thÃ nh cÃ´ng");
    }

    /**
     * Ãp dá»¥ng mÃ£ voucher vÃ o Ä‘Æ¡n hÃ ng Ä‘á»ƒ tÃ­nh toÃ¡n má»©c giáº£m giÃ¡
     * Quyá»n háº¡n: USER, SELLER
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
                    "ThÃ nh cÃ´ng: Giáº£m=" + discount + ", GiÃ¡ trá»‹=" + orderValue + ", Má»©c giáº£m="
                            + voucher.getDiscountValue()
                            + ", Loáº¡i=" + voucher.getDiscountType());
        } catch (RuntimeException e) {
            return ApiResponse.error(400, e.getMessage());
        }
    }

    /**
     * Láº¥y danh sÃ¡ch voucher do shop cá»§a user hiá»‡n táº¡i táº¡o ra
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @GetMapping("/my-shop")
    public ApiResponse<java.util.List<Voucher>> getMyShopVouchers(@RequestParam Long userId) {
        com.liennganh.shopee.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ApiResponse.success(voucherService.getShopVouchers(user),
                "Láº¥y danh sÃ¡ch voucher cá»§a shop thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch voucher cá»§a má»™t shop báº¥t ká»³ hiá»ƒn thá»‹ cho ngÆ°á»i mua
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/shop/{shopId}")
    public ApiResponse<java.util.List<Voucher>> getShopVouchers(@PathVariable Long shopId) {
        return ApiResponse.success(voucherService.getShopVouchersByShopId(shopId),
                "Láº¥y danh sÃ¡ch voucher cá»§a shop thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o voucher má»›i cho shop
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PostMapping("/my-shop")
    public ApiResponse<Voucher> createShopVoucher(@RequestBody Voucher voucher, @RequestParam Long userId) {
        com.liennganh.shopee.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return ApiResponse.success(voucherService.createShopVoucher(voucher, user),
                "Táº¡o voucher cho shop thÃ nh cÃ´ng");
    }

    /**
     * XÃ³a voucher cá»§a shop
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @DeleteMapping("/my-shop/{id}")
    public ApiResponse<Void> deleteShopVoucher(@PathVariable Long id, @RequestParam Long userId) {
        com.liennganh.shopee.entity.User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        voucherService.deleteShopVoucher(id, user);
        return ApiResponse.success(null, "XÃ³a voucher cá»§a shop thÃ nh cÃ´ng");
    }
}

