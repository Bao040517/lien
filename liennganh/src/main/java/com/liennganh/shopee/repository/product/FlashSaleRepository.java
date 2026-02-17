package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository quản lý chương trình Flash Sale
 */
@Repository
public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {

    /**
     * Tìm các Flash Sale đang diễn ra (Active và trong thời gian hiệu lực)
     */
    @Query("SELECT DISTINCT fs FROM FlashSale fs LEFT JOIN FETCH fs.items fsi LEFT JOIN FETCH fsi.product p WHERE fs.isActive = true AND fs.startTime <= :now AND fs.endTime >= :now")
    List<FlashSale> findActiveFlashSales(LocalDateTime now);

    /**
     * Kiểm tra có Flash Sale nào trùng thời gian không (tránh chồng chéo)
     */
    @Query("SELECT COUNT(fs) > 0 FROM FlashSale fs WHERE fs.isActive = true AND fs.startTime < :endTime AND fs.endTime > :startTime")
    boolean existsOverlapping(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Kiểm tra trùng thời gian (trừ ID hiện tại - dùng khi update)
     */
    @Query("SELECT COUNT(fs) > 0 FROM FlashSale fs WHERE fs.isActive = true AND fs.startTime < :endTime AND fs.endTime > :startTime AND fs.id != :excludeId")
    boolean existsOverlappingExcluding(LocalDateTime startTime, LocalDateTime endTime, Long excludeId);
}
