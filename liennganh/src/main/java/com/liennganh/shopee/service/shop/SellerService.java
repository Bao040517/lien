package com.liennganh.shopee.service.shop;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.Product;
import com.liennganh.shopee.entity.Shop;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.repository.product.ProductRepository;
import com.liennganh.shopee.repository.shop.ShopRepository;
import com.liennganh.shopee.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerService {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(SellerService.class);

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final com.liennganh.shopee.service.common.BadWordService badWordService;

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
        shop.setAvatarUrl(shopData.getAvatarUrl());
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
        shop.setAvatarUrl(shopData.getAvatarUrl());

        Shop updatedShop = shopRepository.save(shop);
        log.info("Shop updated: {}", updatedShop.getName());

        return updatedShop;
    }

    public org.springframework.data.domain.Page<Product> getMyProducts(Long sellerId, int page, int size) {
        Shop shop = getMyShop(sellerId);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return productRepository.findByShop(shop, pageable);
    }

    @Transactional
    public Product createProduct(Long sellerId, Product productData) {
        Shop shop = getMyShop(sellerId);

        Product product = new Product();
        product.setName(productData.getName());
        product.setDescription(productData.getDescription());
        product.setPrice(productData.getPrice());
        product.setStockQuantity(productData.getStockQuantity());

        Integer discountPct = productData.getDiscountPercentage();
        if (discountPct == null || discountPct < 0) {
            discountPct = 0;
        }
        product.setDiscountPercentage(discountPct);

        if (discountPct > 0 && productData.getPrice() != null) {
            java.math.BigDecimal discountAmount = productData.getPrice().multiply(new java.math.BigDecimal(discountPct))
                    .divide(new java.math.BigDecimal(100));
            product.setDiscountedPrice(productData.getPrice().subtract(discountAmount));
        } else {
            product.setDiscountedPrice(productData.getPrice());
        }

        product.setImageUrl(productData.getImageUrl());
        product.setShop(shop);
        product.setCategory(productData.getCategory());

        product.setProductStatus("PENDING");

        Product savedProduct = productRepository.save(product);
        log.info("Product created: {} by shop: {} (PENDING)", savedProduct.getName(), shop.getName());

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

        Integer discountPct = productData.getDiscountPercentage();
        if (discountPct == null || discountPct < 0) {
            discountPct = 0;
        }
        product.setDiscountPercentage(discountPct);

        if (discountPct > 0 && productData.getPrice() != null) {
            java.math.BigDecimal discountAmount = productData.getPrice().multiply(new java.math.BigDecimal(discountPct))
                    .divide(new java.math.BigDecimal(100));
            product.setDiscountedPrice(productData.getPrice().subtract(discountAmount));
        } else {
            product.setDiscountedPrice(productData.getPrice());
        }

        product.setImageUrl(productData.getImageUrl());
        product.setCategory(productData.getCategory());

        product.setProductStatus("PENDING");

        Product updatedProduct = productRepository.save(product);
        log.info("Product updated: {} (PENDING)", updatedProduct.getName());

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
