package com.liennganh.shopee.service.product;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.Product;
import com.liennganh.shopee.repository.product.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.liennganh.shopee.repository.product.ProductSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import java.util.List;

import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.service.notification.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private com.liennganh.shopee.repository.shop.ShopRepository shopRepository;
    @Autowired
    private com.liennganh.shopee.repository.product.CategoryRepository categoryRepository;
    @Autowired
    private com.liennganh.shopee.repository.product.ProductAttributeRepository attributeRepository;
    @Autowired
    private com.liennganh.shopee.repository.product.ProductAttributeOptionRepository optionRepository;
    @Autowired
    private com.liennganh.shopee.repository.product.ProductVariantRepository variantRepository;
    @Autowired
    private org.springframework.context.ApplicationContext context;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private com.liennganh.shopee.service.common.BadWordService badWordService;

    /**
     * Public view — chỉ sản phẩm APPROVED
     */
    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByProductStatus("APPROVED", pageable);
    }

    /**
     * Admin view — tất cả sản phẩm
     */
    public Page<Product> getAllProductsIncludingBanned(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    /**
     * Public — theo danh mục, chỉ APPROVED
     */
    public Page<Product> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByCategoryIdAndProductStatus(categoryId, "APPROVED", pageable);
    }

    /**
     * Tạo sản phẩm — mặc định PENDING
     */
    @org.springframework.transaction.annotation.Transactional
    public Product createProduct(Product product) {
        if (product.getShop() != null && product.getShop().getId() != null) {
            Shop shop = shopRepository.findById(product.getShop().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
            product.setShop(shop);
        }
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            product.setCategory(category);
        }

        product.setAverageRating(0.0);
        product.setReviewCount(0L);
        product.setProductStatus("PENDING");

        return productRepository.save(product);
    }

    /**
     * Cập nhật sản phẩm — seller sửa nội dung → quay về PENDING
     */
    @org.springframework.transaction.annotation.Transactional
    public Product updateProduct(Long id, java.util.Map<String, Object> body) {
        Product product = getProductById(id);
        if (body.containsKey("name"))
            product.setName((String) body.get("name"));
        if (body.containsKey("description"))
            product.setDescription((String) body.get("description"));
        if (body.containsKey("price"))
            product.setPrice(new java.math.BigDecimal(body.get("price").toString()));
        if (body.containsKey("stockQuantity"))
            product.setStockQuantity(Integer.parseInt(body.get("stockQuantity").toString()));

        if (body.containsKey("categoryId")) {
            Long categoryId = Long.valueOf(body.get("categoryId").toString());
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            product.setCategory(category);
        }

        if (body.containsKey("name") || body.containsKey("description")) {
            product.setProductStatus("PENDING");
        }

        return productRepository.save(product);
    }

    @org.springframework.transaction.annotation.Transactional
    public Product updateProductImage(Long id, String imageUrl) {
        Product product = getProductById(id);
        product.setImageUrl(imageUrl);
        List<ProductVariant> variants = variantRepository.findByProductId(id);
        for (ProductVariant v : variants) {
            v.setImageUrl(imageUrl);
            variantRepository.save(v);
        }
        return productRepository.save(product);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    /**
     * Public search — chỉ APPROVED
     */
    public Page<Product> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByProductStatusAndNameContainingIgnoreCase("APPROVED", keyword, pageable);
    }

    /**
     * Public filter — chỉ APPROVED
     */
    public Page<Product> filterProducts(String keyword, Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
            String sortBy, int page, int size) {

        Specification<Product> spec = Specification.where(ProductSpecification.nameContains(keyword))
                .and(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.isApprovedStatus());

        Sort sort = Sort.unsorted();
        if ("price_asc".equals(sortBy)) sort = Sort.by("price").ascending();
        else if ("price_desc".equals(sortBy)) sort = Sort.by("price").descending();
        else if ("newest".equals(sortBy)) sort = Sort.by("id").descending();
        else if ("best_selling".equals(sortBy)) sort = Sort.by("reviewCount").descending();
        else if ("rating_desc".equals(sortBy)) sort = Sort.by("averageRating").descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(spec, pageable);
    }

    // ========== ADMIN: THAY ĐỔI TRẠNG THÁI SẢN PHẨM ==========

    public Product changeProductStatus(Long id, String newStatus, String reason) {
        Product product = getProductById(id);
        String oldStatus = product.getProductStatus();
        product.setProductStatus(newStatus);

        if ("BANNED".equals(newStatus) || "REJECTED".equals(newStatus)) {
            product.setViolationReason(reason);
        } else {
            product.setViolationReason(null);
        }

        Product saved = productRepository.save(product);

        if (product.getShop() != null && product.getShop().getOwner() != null) {
            String title;
            String message;
            Notification.NotificationType type;

            switch (newStatus) {
                case "APPROVED":
                    title = "Sản phẩm đã được duyệt: " + product.getName();
                    message = "Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.";
                    type = Notification.NotificationType.SYSTEM;
                    break;
                case "REJECTED":
                    title = "Sản phẩm bị từ chối: " + product.getName();
                    message = "Sản phẩm bị từ chối. Lý do: " + (reason != null ? reason : "Không đạt tiêu chuẩn");
                    type = Notification.NotificationType.SYSTEM;
                    break;
                case "BANNED":
                    title = "Sản phẩm bị khóa: " + product.getName();
                    message = "Sản phẩm bị khóa. Lý do: " + (reason != null ? reason : "Vi phạm chính sách");
                    type = Notification.NotificationType.PRODUCT_BAN;
                    break;
                case "PENDING":
                    title = "Sản phẩm chuyển về chờ duyệt: " + product.getName();
                    message = "Sản phẩm đã được chuyển về trạng thái chờ duyệt.";
                    type = Notification.NotificationType.SYSTEM;
                    break;
                default:
                    return saved;
            }

            notificationService.createNotification(
                    product.getShop().getOwner(), title, message, type, product.getId());
        }

        return saved;
    }

    // Backward-compatible convenience methods
    public Product banProduct(Long id, String reason) {
        return changeProductStatus(id, "BANNED", reason);
    }

    public Product unbanProduct(Long id) {
        return changeProductStatus(id, "APPROVED", null);
    }

    public Product approveProduct(Long id) {
        return changeProductStatus(id, "APPROVED", null);
    }

    public Product rejectProduct(Long id) {
        return changeProductStatus(id, "REJECTED", null);
    }

    /**
     * Seller view — tất cả sản phẩm của shop
     */
    public Page<Product> getProductsByOwner(com.liennganh.shopee.entity.User owner, int page, int size) {
        com.liennganh.shopee.repository.shop.ShopRepository shopRepository = context
                .getBean(com.liennganh.shopee.repository.shop.ShopRepository.class);
        com.liennganh.shopee.entity.Shop shop = shopRepository.findByOwner(owner)
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByShop(shop, pageable);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);

        com.liennganh.shopee.repository.product.ReviewRepository reviewRepository = context
                .getBean(com.liennganh.shopee.repository.product.ReviewRepository.class);
        reviewRepository.deleteByProductId(id);

        com.liennganh.shopee.repository.order.OrderItemRepository orderItemRepository = context
                .getBean(com.liennganh.shopee.repository.order.OrderItemRepository.class);
        orderItemRepository.deleteByProductId(id);

        jakarta.persistence.EntityManager em = context.getBean(jakarta.persistence.EntityManager.class);
        em.createNativeQuery("DELETE FROM cart_items WHERE product_id = :pid")
                .setParameter("pid", id).executeUpdate();
        em.createNativeQuery("DELETE FROM flash_sale_items WHERE product_id = :pid")
                .setParameter("pid", id).executeUpdate();

        productRepository.delete(product);
    }

    /**
     * Public view shop — chỉ APPROVED
     */
    public Page<Product> getProductsByShopId(Long shopId, int page, int size) {
        com.liennganh.shopee.entity.Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByShopAndProductStatus(shop, "APPROVED", pageable);
    }

    // ========== PRODUCT ATTRIBUTES & VARIANTS ==========

    public List<ProductAttribute> getProductAttributes(Long productId) {
        return attributeRepository.findByProductId(productId);
    }

    @org.springframework.transaction.annotation.Transactional
    public ProductAttribute addAttribute(Long productId, String name) {
        Product product = getProductById(productId);
        ProductAttribute attr = new ProductAttribute();
        attr.setProduct(product);
        attr.setName(name);
        return attributeRepository.save(attr);
    }

    @org.springframework.transaction.annotation.Transactional
    public ProductAttributeOption addOption(Long attributeId, String value, String imageUrl) {
        ProductAttribute attr = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        ProductAttributeOption option = new ProductAttributeOption();
        option.setAttribute(attr);
        option.setValue(value);
        option.setImageUrl(imageUrl);
        return optionRepository.save(option);
    }

    public List<ProductVariant> getVariants(Long productId) {
        return variantRepository.findByProductId(productId);
    }

    @org.springframework.transaction.annotation.Transactional
    public ProductVariant addVariant(Long productId, String attributesJson, java.math.BigDecimal price,
            Integer stockQuantity, String imageUrl) {
        Product product = getProductById(productId);
        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setAttributes(attributesJson);
        variant.setPrice(price);
        variant.setStockQuantity(stockQuantity);
        variant.setImageUrl(imageUrl);
        return variantRepository.save(variant);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteVariant(Long variantId) {
        variantRepository.deleteById(variantId);
    }
}
