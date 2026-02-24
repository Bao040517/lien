package com.liennganh.shopee.service.product;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.repository.product.FlashSaleRepository;
import com.liennganh.shopee.repository.product.ProductRepository;
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
            throw new AppException(ErrorCode.FLASH_SALE_CONFLICT);
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
                .orElseThrow(() -> new AppException(ErrorCode.FLASH_SALE_NOT_FOUND));

        if (existingSale.getEndTime().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.FLASH_SALE_ENDED);
        }

        if (flashSaleRepository.existsOverlappingExcluding(flashSaleDetails.getStartTime(),
                flashSaleDetails.getEndTime(), id)) {
            throw new AppException(ErrorCode.FLASH_SALE_CONFLICT);
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

