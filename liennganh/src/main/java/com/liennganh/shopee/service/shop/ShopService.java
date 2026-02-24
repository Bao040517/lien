package com.liennganh.shopee.service.shop;

import com.liennganh.shopee.entity.Shop;
import com.liennganh.shopee.repository.shop.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service quản lý cửa hàng (Shop)
 * Chỉ hỗ trợ các thao tác cơ bản như xem danh sách shop
 */
@Service
public class ShopService {
    @Autowired
    private ShopRepository shopRepository;

    /**
     * Lấy danh sách tất cả cửa hàng
     * 
     */
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    /**
     * Lấy thông tin chi tiết của một cửa hàng
     * 
     * @throws AppException SHOP_NOT_FOUND
     */
    public Shop getShopById(Long id) {
        return shopRepository.findById(id)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
    }
}
