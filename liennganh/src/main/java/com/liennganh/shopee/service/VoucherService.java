package com.liennganh.shopee.service;

import com.liennganh.shopee.model.Voucher;
import com.liennganh.shopee.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.math.BigDecimal;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepository;

    public Voucher createVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    public java.util.List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    public Optional<Voucher> getVoucherByCode(String code) {
        return voucherRepository.findByCode(code);
    }

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

    public void decreaseUsage(Voucher voucher) {
        if (voucher.getUsageLimit() != null) {
            voucher.setUsageLimit(voucher.getUsageLimit() - 1);
            voucherRepository.save(voucher);
        }
    }

    public Voucher createShopVoucher(Voucher voucher, com.liennganh.shopee.model.User owner) {
        if (owner.getShop() == null) {
            throw new RuntimeException("User does not have a shop");
        }
        voucher.setShop(owner.getShop());
        return voucherRepository.save(voucher);
    }

    public java.util.List<Voucher> getShopVouchers(com.liennganh.shopee.model.User owner) {
        if (owner.getShop() == null) {
            return java.util.Collections.emptyList();
        }
        return voucherRepository.findByShopId(owner.getShop().getId());
    }

    public void deleteShopVoucher(Long id, com.liennganh.shopee.model.User owner) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        if (owner.getShop() == null || !voucher.getShop().getId().equals(owner.getShop().getId())) {
            throw new RuntimeException("Unauthorized access to voucher");
        }
        voucherRepository.delete(voucher);
    }

    public BigDecimal applyVoucher(String code, BigDecimal orderValue, Long shopId) {
        Optional<Voucher> voucherOpt = voucherRepository.findByCode(code);
        if (voucherOpt.isEmpty()) {
            throw new RuntimeException("Voucher not found");
        }
        Voucher voucher = voucherOpt.get();

        LocalDateTime now = LocalDateTime.now();
        if (voucher.getStartDate().isAfter(now)) {
            throw new RuntimeException("Voucher not started. Start: " + voucher.getStartDate() + " Now: " + now);
        }
        if (voucher.getEndDate().isBefore(now)) {
            throw new RuntimeException("Voucher expired. End: " + voucher.getEndDate() + " Now: " + now);
        }
        if (voucher.getUsageLimit() != null && voucher.getUsageLimit() <= 0) {
            throw new RuntimeException("Voucher run out of usage. Limit: " + voucher.getUsageLimit());
        }

        // Validate Shop Scope
        if (voucher.getShop() != null) {
            if (shopId == null || !voucher.getShop().getId().equals(shopId)) {
                throw new RuntimeException("Voucher is only valid for shop: " + voucher.getShop().getName());
            }
        }

        // NEW: If voucher is system-wide (shop is null), it can apply to any shop's
        // order
        // However, if we want system vouchers to apply to the TOTAL cart value across
        // all shops,
        // that requires a different architecture (parent order).
        // For now, assuming system vouchers can apply to any sub-order (shop order).

        if (voucher.getMinOrderValue() != null && orderValue.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new RuntimeException("Order value does not meet minimum requirement: " + voucher.getMinOrderValue());
        }

        BigDecimal discountAmount = BigDecimal.ZERO;

        if (voucher.getDiscountType() == Voucher.DiscountType.FIXED) {
            discountAmount = voucher.getDiscountValue();
        } else {
            discountAmount = orderValue.multiply(voucher.getDiscountValue()).divide(BigDecimal.valueOf(100), 0,
                    java.math.RoundingMode.HALF_UP);
        }

        // Ensure discount doesn't exceed order value
        if (discountAmount.compareTo(orderValue) > 0) {
            discountAmount = orderValue;
        }

        return discountAmount;
    }

    public java.util.List<Voucher> getShopVouchersByShopId(Long shopId) {
        // Only return valid vouchers for public view if needed, but for now return all
        // Or filter by active status if required.
        // Let's return all for now as user requested "all vouchers"
        return voucherRepository.findByShopId(shopId);
    }
}
