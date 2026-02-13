package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.Product;
import com.liennganh.shopee.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.liennganh.shopee.repository.ProductSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private com.liennganh.shopee.repository.ShopRepository shopRepository;
    @Autowired
    private org.springframework.context.ApplicationContext context;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @org.springframework.transaction.annotation.Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public List<Product> filterProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
            String sortBy) {
        Specification<Product> spec = Specification.where(ProductSpecification.nameContains(keyword))
                .and(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));

        Sort sort = Sort.unsorted();
        if ("price_asc".equals(sortBy)) {
            sort = Sort.by("price").ascending();
        } else if ("price_desc".equals(sortBy)) {
            sort = Sort.by("price").descending();
        } else if ("sales_desc".equals(sortBy)) {
            sort = Sort.by("id").descending(); // Placeholder for sales sort
        }

        return productRepository.findAll(spec, sort);
    }

    public List<Product> getProductsByOwner(com.liennganh.shopee.model.User owner) {
        com.liennganh.shopee.repository.ShopRepository shopRepository = context
                .getBean(com.liennganh.shopee.repository.ShopRepository.class);
        com.liennganh.shopee.model.Shop shop = shopRepository.findByOwner(owner)
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
        return productRepository.findByShop(shop);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
