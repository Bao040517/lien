package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface FlashSaleRepository extends JpaRepository<FlashSale, Long> {

    @Query("SELECT DISTINCT fs FROM FlashSale fs LEFT JOIN FETCH fs.items fsi LEFT JOIN FETCH fsi.product p WHERE fs.isActive = true AND fs.startTime <= :now AND fs.endTime >= :now")
    List<FlashSale> findActiveFlashSales(LocalDateTime now);

    @Query("SELECT COUNT(fs) > 0 FROM FlashSale fs WHERE fs.isActive = true AND fs.startTime < :endTime AND fs.endTime > :startTime")
    boolean existsOverlapping(LocalDateTime startTime, LocalDateTime endTime);

    @Query("SELECT COUNT(fs) > 0 FROM FlashSale fs WHERE fs.isActive = true AND fs.startTime < :endTime AND fs.endTime > :startTime AND fs.id != :excludeId")
    boolean existsOverlappingExcluding(LocalDateTime startTime, LocalDateTime endTime, Long excludeId);
}
