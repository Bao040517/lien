package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.*;
import com.liennganh.shopee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlashSaleService {
    @Autowired
    private FlashSaleRepository flashSaleRepository;
    @Autowired
    private ProductRepository productRepository;

    public List<FlashSale> getActiveFlashSales() {
        return flashSaleRepository.findActiveFlashSales(LocalDateTime.now());
    }

    public List<FlashSale> getAllFlashSales() {
        return flashSaleRepository.findAll(org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "startTime"));
    }

    @Transactional
    public FlashSale createFlashSale(FlashSale flashSale) {
        if (flashSaleRepository.existsOverlapping(flashSale.getStartTime(), flashSale.getEndTime())) {
            throw new RuntimeException("Khoảng thời gian này đã có Flash Sale khác diễn ra!");
        }
        if (flashSale.getItems() != null) {
            for (FlashSaleItem item : flashSale.getItems()) {
                item.setFlashSale(flashSale);
            }
        }
        return flashSaleRepository.save(flashSale);
    }

    @Transactional
    public FlashSale updateFlashSale(Long id, FlashSale flashSaleDetails) {
        FlashSale existingSale = flashSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flash Sale not found"));

        if (existingSale.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Flash Sale đã kết thúc, không thể chỉnh sửa!");
        }

        if (flashSaleRepository.existsOverlappingExcluding(flashSaleDetails.getStartTime(),
                flashSaleDetails.getEndTime(), id)) {
            throw new RuntimeException("Khoảng thời gian này đã có Flash Sale khác diễn ra!");
        }

        existingSale.setName(flashSaleDetails.getName());
        existingSale.setStartTime(flashSaleDetails.getStartTime());
        existingSale.setEndTime(flashSaleDetails.getEndTime());
        existingSale.setActive(flashSaleDetails.isActive());

        // Update items logic
        // Clear existing details and replace (simple approach as requested for editing
        // "products")
        // To do it properly we should remove orphans.
        // For simplicity and effectiveness in this context:
        existingSale.getItems().clear();
        if (flashSaleDetails.getItems() != null) {
            for (FlashSaleItem newItem : flashSaleDetails.getItems()) {
                newItem.setFlashSale(existingSale);
                existingSale.getItems().add(newItem);
            }
        }

        return flashSaleRepository.save(existingSale);
    }
}
