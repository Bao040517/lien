package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.Product;
import com.liennganh.shopee.model.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByShopId(Long shopId);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByShop(Shop shop);

    Long countByShop(Shop shop);
}
