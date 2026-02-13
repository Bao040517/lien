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
        if (flashSale.getItems() != null) {
            for (FlashSaleItem item : flashSale.getItems()) {
                item.setFlashSale(flashSale);
            }
        }
        return flashSaleRepository.save(flashSale);
    }
}
