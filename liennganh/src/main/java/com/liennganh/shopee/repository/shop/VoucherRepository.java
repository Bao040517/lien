package com.liennganh.shopee.repository.shop;

import com.liennganh.shopee.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository quản lý mã giảm giá (Voucher)
 */
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    /**
     * Tìm voucher theo mã code
     */
    Optional<Voucher> findByCode(String code);

    /**
     * Lấy danh sách voucher của một Shop
     */
    List<Voucher> findByShopId(Long shopId);

    /**
     * Tìm các voucher đang có hiệu lực (chưa hết hạn)
     * Thường dùng để hiển thị voucher khả dụng
     */
    List<Voucher> findByEndDateAfterAndStartDateBefore(LocalDateTime endDate, LocalDateTime startDate);
}
