package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.Product;
import com.liennganh.shopee.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Page<Product> findByProductStatus(String productStatus, Pageable pageable);

    Page<Product> findByShop(Shop shop, Pageable pageable);

    List<Product> findAllByShop(Shop shop);

    Long countByShop(Shop shop);

    Page<Product> findByShopAndProductStatus(Shop shop, String productStatus, Pageable pageable);

    Page<Product> findByProductStatusAndNameContainingIgnoreCase(String productStatus, String name, Pageable pageable);

    Page<Product> findByCategoryIdAndProductStatus(Long categoryId, String productStatus, Pageable pageable);
}
