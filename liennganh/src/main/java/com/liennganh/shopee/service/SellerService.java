package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.Product;
import com.liennganh.shopee.model.Shop;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.repository.ProductRepository;
import com.liennganh.shopee.repository.ShopRepository;
import com.liennganh.shopee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SellerService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    public Shop getMyShop(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if user is seller
        if (seller.getRole() != User.Role.SELLER) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Check seller status
        if (seller.getSellerStatus() != User.SellerStatus.APPROVED) {
            throw new AppException(ErrorCode.SELLER_NOT_APPROVED);
        }

        return shopRepository.findByOwner(seller)
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
    }

    @Transactional
    public Shop createShop(Long sellerId, Shop shopData) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Check if user is seller
        if (seller.getRole() != User.Role.SELLER) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Check seller status
        if (seller.getSellerStatus() != User.SellerStatus.APPROVED) {
            throw new AppException(ErrorCode.SELLER_NOT_APPROVED);
        }

        // Check if seller already has a shop
        if (shopRepository.findByOwner(seller).isPresent()) {
            throw new AppException(ErrorCode.SHOP_ALREADY_EXISTS);
        }

        Shop shop = new Shop();
        shop.setName(shopData.getName());
        shop.setDescription(shopData.getDescription());
        shop.setOwner(seller);

        Shop savedShop = shopRepository.save(shop);
        log.info("Shop created: {} by seller: {}", savedShop.getName(), seller.getUsername());

        return savedShop;
    }

    @Transactional
    public Shop updateShop(Long sellerId, Shop shopData) {
        Shop shop = getMyShop(sellerId);

        shop.setName(shopData.getName());
        shop.setDescription(shopData.getDescription());

        Shop updatedShop = shopRepository.save(shop);
        log.info("Shop updated: {}", updatedShop.getName());

        return updatedShop;
    }

    public List<Product> getMyProducts(Long sellerId) {
        Shop shop = getMyShop(sellerId);
        return productRepository.findByShop(shop);
    }

    @Transactional
    public Product createProduct(Long sellerId, Product productData) {
        Shop shop = getMyShop(sellerId);

        Product product = new Product();
        product.setName(productData.getName());
        product.setDescription(productData.getDescription());
        product.setPrice(productData.getPrice());
        product.setStockQuantity(productData.getStockQuantity());
        product.setImageUrl(productData.getImageUrl());
        product.setShop(shop);
        product.setCategory(productData.getCategory());

        Product savedProduct = productRepository.save(product);
        log.info("Product created: {} by shop: {}", savedProduct.getName(), shop.getName());

        return savedProduct;
    }

    @Transactional
    public Product updateProduct(Long sellerId, Long productId, Product productData) {
        Shop shop = getMyShop(sellerId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Check if product belongs to seller's shop
        if (!product.getShop().getId().equals(shop.getId())) {
            throw new AppException(ErrorCode.NOT_SHOP_OWNER);
        }

        product.setName(productData.getName());
        product.setDescription(productData.getDescription());
        product.setPrice(productData.getPrice());
        product.setStockQuantity(productData.getStockQuantity());
        product.setImageUrl(productData.getImageUrl());
        product.setCategory(productData.getCategory());

        Product updatedProduct = productRepository.save(product);
        log.info("Product updated: {}", updatedProduct.getName());

        return updatedProduct;
    }

    @Transactional
    public void deleteProduct(Long sellerId, Long productId) {
        Shop shop = getMyShop(sellerId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Check if product belongs to seller's shop
        if (!product.getShop().getId().equals(shop.getId())) {
            throw new AppException(ErrorCode.NOT_SHOP_OWNER);
        }

        productRepository.delete(product);
        log.info("Product deleted: {}", product.getName());
    }
}
