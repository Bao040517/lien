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

/**
 * Service quản lý sản phẩm
 * Bao gồm CRUD sản phẩm, tìm kiếm, lọc, và quản lý biến thể (variants)
 */
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

    /**
     * Lấy danh sách sản phẩm chưa bị khóa (Public view)
     * 
     */
    public List<Product> getAllProducts() {
        return productRepository.findByIsBannedFalse();
    }

    /**
     * Lấy tất cả sản phẩm kể cả bị khóa (Admin only)
     */
    public List<Product> getAllProductsIncludingBanned() {
        return productRepository.findAll();
    }

    /**
     * Lấy danh sách sản phẩm theo danh mục (chưa bị khóa)
     * 
     */
    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryIdAndIsBannedFalse(categoryId);
    }

    /**
     * Tạo sản phẩm mới
     * 
     * @throws AppException SHOP_NOT_FOUND, CATEGORY_NOT_FOUND
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

        // Khởi tạo đánh giá
        product.setAverageRating(0.0);
        product.setReviewCount(0L);

        return productRepository.save(product);
    }

    /**
     * Cập nhật thông tin sản phẩm
     * 
     * stockQuantity, categoryId)
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

        return productRepository.save(product);
    }

    /**
     * Cập nhật ảnh đại diện sản phẩm
     * Đồng thời cập nhật ảnh cho tất cả biến thể của sản phẩm đó
     * 
     */
    @org.springframework.transaction.annotation.Transactional
    public Product updateProductImage(Long id, String imageUrl) {
        Product product = getProductById(id);
        product.setImageUrl(imageUrl);

        // Đồng bộ ảnh cho variants
        List<ProductVariant> variants = variantRepository.findByProductId(id);
        for (ProductVariant v : variants) {
            v.setImageUrl(imageUrl);
            variantRepository.save(v);
        }
        return productRepository.save(product);
    }

    /**
     * Lưu trực tiếp entity Product vào DB
     */
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Lấy thông tin chi tiết sản phẩm
     * 
     * @throws AppException PRODUCT_NOT_FOUND
     */
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    /**
     * Tìm kiếm sản phẩm theo tên (không phân biệt hoa thường, chưa bị khóa)
     * 
     */
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCaseAndIsBannedFalse(keyword);
    }

    /**
     * Lọc và sắp xếp sản phẩm nâng cao
     * 
     * best_selling, rating_desc)
     */
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
        } else if ("newest".equals(sortBy)) {
            sort = Sort.by("id").descending();
        } else if ("best_selling".equals(sortBy)) {
            sort = Sort.by("reviewCount").descending(); // Tạm dùng reviewCount làm proxy cho bán chạy
        } else if ("rating_desc".equals(sortBy)) {
            sort = Sort.by("averageRating").descending();
        }

        return productRepository.findAll(spec, sort);
    }

    /**
     * Khóa sản phẩm (Admin only)
     * 
     */
    public Product banProduct(Long id, String reason) {
        Product product = getProductById(id);
        product.setBanned(true);
        product.setViolationReason(reason);
        Product savedProduct = productRepository.save(product);

        // Thông báo cho Seller
        if (product.getShop() != null && product.getShop().getOwner() != null) {
            notificationService.createNotification(
                    product.getShop().getOwner(),
                    "Sản phẩm bị khóa: " + product.getName(),
                    "Sản phẩm của bạn đã bị khóa vì lý do: " + reason,
                    com.liennganh.shopee.entity.Notification.NotificationType.PRODUCT_BAN,
                    product.getId());
        }
        return savedProduct;
    }

    /**
     * Mở khóa sản phẩm (Admin only)
     * 
     */
    public Product unbanProduct(Long id) {
        Product product = getProductById(id);
        product.setBanned(false);
        product.setViolationReason(null);
        Product savedProduct = productRepository.save(product);

        // Thông báo cho Seller
        if (product.getShop() != null && product.getShop().getOwner() != null) {
            notificationService.createNotification(
                    product.getShop().getOwner(),
                    "Sản phẩm được khôi phục: " + product.getName(),
                    "Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.",
                    com.liennganh.shopee.entity.Notification.NotificationType.PRODUCT_UNBAN,
                    product.getId());
        }
        return savedProduct;
    }

    /**
     * Lấy danh sách sản phẩm của một chủ shop (User)
     */
    public List<Product> getProductsByOwner(com.liennganh.shopee.entity.User owner) {
        com.liennganh.shopee.repository.shop.ShopRepository shopRepository = context
                .getBean(com.liennganh.shopee.repository.shop.ShopRepository.class);
        com.liennganh.shopee.entity.Shop shop = shopRepository.findByOwner(owner)
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
        return productRepository.findByShop(shop);
    }

    /**
     * Xóa sản phẩm vĩnh viễn
     * Xóa tất cả dữ liệu liên quan (reviews, order items, cart items, flash sale
     * items) trước
     */
    @org.springframework.transaction.annotation.Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);

        // Xóa reviews
        com.liennganh.shopee.repository.product.ReviewRepository reviewRepository = context
                .getBean(com.liennganh.shopee.repository.product.ReviewRepository.class);
        reviewRepository.deleteByProductId(id);

        // Xóa order items
        com.liennganh.shopee.repository.order.OrderItemRepository orderItemRepository = context
                .getBean(com.liennganh.shopee.repository.order.OrderItemRepository.class);
        orderItemRepository.deleteByProductId(id);

        // Xóa cart items & flash sale items qua EntityManager (không có repo riêng)
        jakarta.persistence.EntityManager em = context.getBean(jakarta.persistence.EntityManager.class);
        em.createNativeQuery("DELETE FROM cart_items WHERE product_id = :pid")
                .setParameter("pid", id).executeUpdate();
        em.createNativeQuery("DELETE FROM flash_sale_items WHERE product_id = :pid")
                .setParameter("pid", id).executeUpdate();

        // Cuối cùng xóa product (attributes, variants, images sẽ cascade theo entity
        // config)
        productRepository.delete(product);
    }

    /**
     * Lấy danh sách sản phẩm theo Shop ID (Public view - chỉ hiện sản phẩm chưa bị
     * khóa)
     */
    public List<Product> getProductsByShopId(Long shopId) {
        com.liennganh.shopee.entity.Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new AppException(ErrorCode.SHOP_NOT_FOUND));
        return productRepository.findByShopAndIsBannedFalse(shop);
    }

    // ========== PRODUCT ATTRIBUTES & VARIANTS (PHÂN LOẠI & BIẾN THỂ) ==========

    /**
     * Lấy danh sách thuộc tính (Attribute) của sản phẩm
     */
    public List<ProductAttribute> getProductAttributes(Long productId) {
        return attributeRepository.findByProductId(productId);
    }

    /**
     * Thêm thuộc tính cho sản phẩm (Ví dụ: Màu sắc, Size)
     */
    @org.springframework.transaction.annotation.Transactional
    public ProductAttribute addAttribute(Long productId, String name) {
        Product product = getProductById(productId);
        ProductAttribute attr = new ProductAttribute();
        attr.setProduct(product);
        attr.setName(name);
        return attributeRepository.save(attr);
    }

    /**
     * Thêm giá trị cho thuộc tính (Ví dụ: Đỏ, Xanh, S, M)
     */
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

    /**
     * Lấy danh sách biến thể (Variant) của sản phẩm
     */
    public List<ProductVariant> getVariants(Long productId) {
        return variantRepository.findByProductId(productId);
    }

    /**
     * Thêm biến thể sản phẩm (Variant)
     * Mỗi variant là sự kết hợp của các options (ví dụ: Màu Đỏ - Size M)
     */
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

    /**
     * Xóa biến thể sản phẩm
     */
    @org.springframework.transaction.annotation.Transactional
    public void deleteVariant(Long variantId) {
        variantRepository.deleteById(variantId);
    }
}
