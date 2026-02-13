package com.liennganh.shopee.service;

import com.liennganh.shopee.model.Shop;
import com.liennganh.shopee.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShopService {
    @Autowired
    private ShopRepository shopRepository;

    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    public Shop getShopById(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
    }
}
