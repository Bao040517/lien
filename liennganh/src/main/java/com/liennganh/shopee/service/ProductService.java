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
        return productRepository.findByCategoryIdAndIsBannedFalse(categoryId);
    }

    @org.springframework.transaction.annotation.Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseAndIsBannedFalse(keyword);
    }

    public List<Product> filterProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
            String sortBy) {
        Specification<Product> spec = Specification.where(ProductSpecification.nameContains(keyword))
                .and(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.isNotBanned());

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

    @Autowired
    private NotificationService notificationService;

    public Product banProduct(Long id, String reason) {
        Product product = getProductById(id);
        product.setBanned(true);
        product.setViolationReason(reason);
        Product savedProduct = productRepository.save(product);

        // Notify Seller
        if (product.getShop() != null && product.getShop().getOwner() != null) {
            notificationService.createNotification(
                    product.getShop().getOwner(),
                    "Sản phẩm bị khóa: " + product.getName(),
                    "Sản phẩm của bạn đã bị khóa vì lý do: " + reason,
                    "PRODUCT_BAN",
                    "/seller/products");
        }
        return savedProduct;
    }

    public Product unbanProduct(Long id) {
        Product product = getProductById(id);
        product.setBanned(false);
        product.setViolationReason(null);
        Product savedProduct = productRepository.save(product);

        // Notify Seller
        if (product.getShop() != null && product.getShop().getOwner() != null) {
            notificationService.createNotification(
                    product.getShop().getOwner(),
                    "Sản phẩm được khôi phục: " + product.getName(),
                    "Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.",
                    "PRODUCT_UNBAN",
                    "/seller/products");
        }
        return savedProduct;
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

    public List<Product> getProductsByShopId(Long shopId) {
        com.liennganh.shopee.model.Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
        return productRepository.findByShopAndIsBannedFalse(shop);
    }
}
