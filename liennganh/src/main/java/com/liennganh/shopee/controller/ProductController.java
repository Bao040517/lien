package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.service.product.ProductService;
import com.liennganh.shopee.service.common.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Controller quản lý sản phẩm
 * GET endpoints: Public (không cần đăng nhập)
 * POST/PUT/DELETE endpoints: SELLER (chủ shop) hoặc ADMIN
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Lấy danh sách tất cả sản phẩm
     * Quyền hạn: Public
     * 
     */
    @GetMapping
    public ApiResponse<List<Product>> getAllProducts() {
        return ApiResponse.success(productService.getAllProducts(), "Lấy danh sách sản phẩm thành công");
    }

    /**
     * Xem chi tiết sản phẩm theo ID
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/{id}")
    public ApiResponse<Product> getProductById(@PathVariable Long id) {
        return ApiResponse.success(productService.getProductById(id), "Lấy thông tin sản phẩm thành công");
    }

    /**
     * Lấy danh sách sản phẩm của một shop cụ thể
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/shop/{shopId}")
    public ApiResponse<List<Product>> getProductsByShop(@PathVariable Long shopId) {
        return ApiResponse.success(productService.getProductsByShopId(shopId),
                "Lấy danh sách sản phẩm của shop thành công");
    }

    /**
     * Lấy danh sách sản phẩm theo danh mục
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ApiResponse.success(productService.getProductsByCategory(categoryId),
                "Lấy danh sách sản phẩm theo danh mục thành công");
    }

    /**
     * Tìm kiếm sản phẩm theo tên
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/search")
    public ApiResponse<List<Product>> searchProducts(@RequestParam String keyword) {
        return ApiResponse.success(productService.searchProducts(keyword), "Tìm kiếm sản phẩm thành công");
    }

    /**
     * Lọc và sắp xếp sản phẩm nâng cao
     * Quyền hạn: Public
     * 
     *                   rating_desc, best_selling)
     */
    @GetMapping("/filter")
    public ApiResponse<List<Product>> filterProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy) {
        return ApiResponse.success(productService.filterProducts(keyword, categoryId, minPrice, maxPrice, sortBy),
                "Lọc sản phẩm thành công");
    }

    /**
     * Tạo sản phẩm mới (chỉ thông tin, không kèm ảnh)
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PostMapping
    public ApiResponse<Product> createProduct(@RequestBody Product product) {
        return ApiResponse.success(productService.createProduct(product), "Tạo sản phẩm thành công");
    }

    /**
     * Tạo sản phẩm mới kèm upload ảnh
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PostMapping("/with-image")
    public ApiResponse<Product> createProductWithImage(
            @RequestParam Long shopId,
            @RequestParam Long categoryId,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam BigDecimal price,
            @RequestParam Integer stockQuantity,
            @RequestParam("image") MultipartFile imageFile) {
        try {
            String fileName = fileStorageService.storeFile(imageFile);
            String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/files/")
                    .path(fileName)
                    .toUriString();

            Product product = new Product();
            product.setShop(new Shop());
            product.getShop().setId(shopId);
            product.setCategory(new Category());
            product.getCategory().setId(categoryId);
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStockQuantity(stockQuantity);
            product.setImageUrl(imageUrl);

            return ApiResponse.success(productService.createProduct(product),
                    "Tạo sản phẩm kèm ảnh thành công");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lỗi khi tạo sản phẩm: " + e.getMessage());
        }
    }

    /**
     * Lấy danh sách sản phẩm của shop do user hiện tại quản lý
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @GetMapping("/my-shop")
    public ApiResponse<List<Product>> getProductsByOwner(@RequestParam Long userId) {
        User user = new User();
        user.setId(userId);
        return ApiResponse.success(productService.getProductsByOwner(user),
                "Lấy danh sách sản phẩm của shop thành công");
    }

    /**
     * Xóa sản phẩm
     * Quyền hạn: SELLER (chủ sản phẩm) hoặc ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success(null, "Xóa sản phẩm thành công");
    }

    /**
     * Khóa sản phẩm (Ban) - dành cho Admin
     * Quyền hạn: ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/ban")
    public ApiResponse<Product> banProduct(@PathVariable Long id, @RequestParam String reason) {
        return ApiResponse.success(productService.banProduct(id, reason), "Khóa sản phẩm thành công");
    }

    /**
     * Mở khóa sản phẩm (Unban) - dành cho Admin
     * Quyền hạn: ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/unban")
    public ApiResponse<Product> unbanProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.unbanProduct(id), "Mở khóa sản phẩm thành công");
    }

    /**
     * Cập nhật thông tin sản phẩm
     * Quyền hạn: SELLER (chủ sản phẩm) hoặc ADMIN
     * 
     *             stockQuantity, categoryId)
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ApiResponse.success(productService.updateProduct(id, body), "Cập nhật sản phẩm thành công");
    }

    /**
     * Cập nhật sản phẩm kèm upload ảnh mới
     * Quyền hạn: SELLER (chủ sản phẩm) hoặc ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PutMapping(value = "/{id}/with-image", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Product> updateProductWithImage(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) Integer stockQuantity,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            Map<String, Object> updates = new java.util.HashMap<>();
            if (name != null)
                updates.put("name", name);
            if (description != null)
                updates.put("description", description);
            if (price != null)
                updates.put("price", price);
            if (stockQuantity != null)
                updates.put("stockQuantity", stockQuantity);

            Product product = productService.updateProduct(id, updates);

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = fileStorageService.storeFile(imageFile);
                String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/files/")
                        .path(fileName)
                        .toUriString();
                product = productService.updateProductImage(id, imageUrl);
            }

            return ApiResponse.success(product, "Cập nhật sản phẩm thành công");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lỗi khi cập nhật sản phẩm: " + e.getMessage());
        }
    }

    // ========== THUỘC TÍNH SẢN PHẨM (ATTRIBUTES) ==========

    /**
     * Lấy danh sách thuộc tính của sản phẩm
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/{productId}/attributes")
    public ApiResponse<List<ProductAttribute>> getProductAttributes(@PathVariable Long productId) {
        return ApiResponse.success(productService.getProductAttributes(productId),
                "Lấy danh sách thuộc tính thành công");
    }

    /**
     * Thêm thuộc tính mới cho sản phẩm
     * Quyền hạn: SELLER, ADMIN (Cần bổ sung Authorization sau)
     * 
     */
    @PostMapping("/{productId}/attributes")
    public ApiResponse<ProductAttribute> addAttribute(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body) {
        return ApiResponse.success(productService.addAttribute(productId, (String) body.get("name")),
                "Thêm thuộc tính thành công");
    }

    /**
     * Thêm tùy chọn (option) cho thuộc tính
     * Quyền hạn: SELLER, ADMIN (Cần bổ sung Authorization sau)
     * 
     */
    @PostMapping("/attributes/{attributeId}/options")
    public ApiResponse<ProductAttributeOption> addOption(
            @PathVariable Long attributeId,
            @RequestBody Map<String, Object> body) {
        return ApiResponse.success(
                productService.addOption(attributeId, (String) body.get("value"), (String) body.get("imageUrl")),
                "Thêm tùy chọn thành công");
    }

    // ========== BIẾN THỂ SẢN PHẨM (VARIANTS) ==========

    /**
     * Lấy danh sách biến thể của sản phẩm
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/{productId}/variants")
    public ApiResponse<List<ProductVariant>> getVariants(@PathVariable Long productId) {
        return ApiResponse.success(productService.getVariants(productId), "Lấy danh sách biến thể thành công");
    }

    /**
     * Thêm biến thể mới cho sản phẩm
     * Quyền hạn: SELLER, ADMIN (Cần bổ sung Authorization sau)
     * 
     */
    @PostMapping("/{productId}/variants")
    public ApiResponse<ProductVariant> addVariant(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body) {
        return ApiResponse.success(productService.addVariant(
                productId,
                body.get("attributes").toString(),
                new BigDecimal(body.get("price").toString()),
                Integer.parseInt(body.get("stockQuantity").toString()),
                (String) body.get("imageUrl")),
                "Thêm biến thể thành công");
    }

    /**
     * Xóa biến thể
     * Quyền hạn: SELLER, ADMIN (Cần bổ sung Authorization sau)
     * 
     */
    @DeleteMapping("/variants/{variantId}")
    public ApiResponse<Void> deleteVariant(@PathVariable Long variantId) {
        productService.deleteVariant(variantId);
        return ApiResponse.success(null, "Xóa biến thể thành công");
    }
}
