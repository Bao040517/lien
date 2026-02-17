package com.liennganh.shopee.service.shop;

import com.liennganh.shopee.entity.Voucher;
import com.liennganh.shopee.repository.shop.VoucherRepository;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.math.BigDecimal;

/**
 * Service quản lý Mã giảm giá (Voucher)
 * Xử lý logic tạo, áp dụng và kiểm tra voucher
 */
@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

    /**
     * Tạo voucher mới (Admin/System)
     * 
     */
    public Voucher createVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    /**
     * Lấy danh sách tất cả voucher
     * 
     */
    public java.util.List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    /**
     * Tìm voucher theo mã code
     * 
     */
    public Optional<Voucher> getVoucherByCode(String code) {
        return voucherRepository.findByCode(code);
    }

    /**
     * Kiểm tra voucher có hợp lệ không (thời gian, số lượt dùng)
     * 
     */
    public boolean isValid(Voucher voucher) {
        LocalDateTime now = LocalDateTime.now();
        if (voucher.getStartDate().isAfter(now) || voucher.getEndDate().isBefore(now)) {
            return false;
        }
        if (voucher.getUsageLimit() != null && voucher.getUsageLimit() <= 0) {
            return false;
        }
        return true;
    }

    /**
     * Giảm số lượt sử dụng của voucher sau khi áp dụng thành công
     * 
     */
    public void decreaseUsage(Voucher voucher) {
        if (voucher.getUsageLimit() != null) {
            voucher.setUsageLimit(voucher.getUsageLimit() - 1);
            voucherRepository.save(voucher);
        }
    }

    /**
     * Tạo voucher cho Shop (Seller)
     * 
     * @throws AppException SHOP_NOT_FOUND, INVALID_INPUT
     */
    public Voucher createShopVoucher(Voucher voucher, com.liennganh.shopee.entity.User owner) {
        if (owner.getShop() == null) {
            throw new AppException(ErrorCode.SHOP_NOT_FOUND);
        }
        if (voucher.getStartDate().isAfter(voucher.getEndDate())
                || voucher.getStartDate().isEqual(voucher.getEndDate())) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }
        voucher.setShop(owner.getShop());
        return voucherRepository.save(voucher);
    }

    /**
     * Lấy danh sách voucher của Shop mình đang quản lý
     * 
     */
    public java.util.List<Voucher> getShopVouchers(com.liennganh.shopee.entity.User owner) {
        if (owner.getShop() == null) {
            return java.util.Collections.emptyList();
        }
        return voucherRepository.findByShopId(owner.getShop().getId());
    }

    /**
     * Xóa voucher của Shop
     * Chỉ chủ shop mới được xóa voucher của mình
     * 
     * @throws AppException VOUCHER_NOT_FOUND, NOT_SHOP_OWNER
     */
    public void deleteShopVoucher(Long id, com.liennganh.shopee.entity.User owner) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        if (owner.getShop() == null || !voucher.getShop().getId().equals(owner.getShop().getId())) {
            throw new AppException(ErrorCode.NOT_SHOP_OWNER);
        }
        voucherRepository.delete(voucher);
    }

    /**
     * Tính toán số tiền giảm giá khi áp dụng voucher
     * (Lưu ý: Logic này dùng để tính toán preview, việc áp dụng thật sự nằm ở
     * OrderService)
     * 
     * @throws AppException Các lỗi liên quan validation voucher
     */
    public BigDecimal applyVoucher(String code, BigDecimal orderValue, Long shopId) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code);
        if (voucherOpt.isEmpty()) {
            throw new AppException(ErrorCode.VOUCHER_NOT_FOUND);
        }
        Voucher voucher = voucherOpt.get();

        LocalDateTime now = LocalDateTime.now();
        if (voucher.getStartDate().isAfter(now)) {
            throw new AppException(ErrorCode.VOUCHER_NOT_STARTED);
        }
        if (voucher.getEndDate().isBefore(now)) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }
        if (voucher.getUsageLimit() != null && voucher.getUsageLimit() <= 0) {
            throw new AppException(ErrorCode.VOUCHER_OUT_OF_USAGE);
        }

        // Kiểm tra phạm vi áp dụng (theo Shop)
        if (voucher.getShop() != null) {
            if (shopId == null || !voucher.getShop().getId().equals(shopId)) {
                throw new AppException(ErrorCode.INVALID_VOUCHER_CODE);
            }
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (voucher.getMinOrderValue() != null && orderValue.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new AppException(ErrorCode.ORDER_NOT_MEET_MIN_VALUE);
        }

        BigDecimal discountAmount = BigDecimal.ZERO;

        if (voucher.getDiscountType() == Voucher.DiscountType.FIXED) {
            discountAmount = voucher.getDiscountValue();
        } else {
            // Giảm theo %
            discountAmount = orderValue.multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100), 0,
                    java.math.RoundingMode.HALF_UP);
        }

        // Đảm bảo tiền giảm không vượt quá giá trị đơn hàng
        if (discountAmount.compareTo(orderValue) > 0) {
            discountAmount = orderValue;
        }

        return discountAmount;
    }

    /**
     * Lấy danh sách voucher công khai của một Shop
     * (Để hiển thị cho khách hàng xem và lưu)
     * 
     */
    public java.util.List<Voucher> getShopVouchersByShopId(Long shopId) {
        return voucherRepository.findByShopId(shopId);
    }
}
