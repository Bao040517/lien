package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByCode(String code);

    List<Voucher> findByShopId(Long shopId);

    // Find valid vouchers
    List<Voucher> findByEndDateAfterAndStartDateBefore(LocalDateTime endDate, LocalDateTime startDate);
}
