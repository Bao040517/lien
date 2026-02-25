package com.liennganh.shopee.controller.product;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.service.product.ProductService;
import com.liennganh.shopee.service.common.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.math.BigDecimal;
import java.util.ArrayList;
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
     * Lấy danh sách sản phẩm (chưa bị khóa)
     * Quyền hạn: Public
     */
    @GetMapping
    public ApiResponse<org.springframework.data.domain.Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(productService.getAllProducts(page, size),
                "Lấy danh sách sản phẩm thành công");
    }

    /**
     * Lấy tất cả sản phẩm kể cả bị khóa (Admin only)
     * Quyền hạn: ADMIN
     */
    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<org.springframework.data.domain.Page<Product>> getAllProductsAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return ApiResponse.success(productService.getAllProductsIncludingBanned(page, size),
                "Lấy tất cả sản phẩm thành công");
    }

    /**
     * Xem chi tiết sản phẩm theo ID
     * Sản phẩm bị khóa: chỉ ADMIN và SELLER (chủ sản phẩm) mới
     * xem được
     */
    @GetMapping("/{id}")
    public ApiResponse<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);

        // Nếu sản phẩm bị khóa → kiểm tra quyền xem
        if (product.isBanned()) {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();

            boolean isAdmin = false;
            boolean isOwner = false;

            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                // Kiểm tra role ADMIN
                isAdmin = auth.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

                // Kiểm tra SELLER chủ sản phẩm
                if (!isAdmin) {
                    String username = null;
                    Object principal = auth.getPrincipal();
                    if (principal instanceof String) {
                        username = (String) principal;
                    } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                        username = ((org.springframework.security.core.userdetails.UserDetails) principal)
                                .getUsername();
                    }
                    if (username != null) {
                        isOwner = product.getShop() != null
                                && product.getShop().getOwner() != null
                                && username.equals(product.getShop().getOwner().getUsername());
                    }
                }
            }

            if (!isAdmin && !isOwner) {
                throw new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.PRODUCT_NOT_FOUND);
            }
        }

        return ApiResponse.success(product, "Lấy thông tin sản phẩm thành công");
    }

    /**
     * Lấy danh sách sản phẩm của một shop cụ thể
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/shop/{shopId}")
    public ApiResponse<org.springframework.data.domain.Page<Product>> getProductsByShop(
            @PathVariable Long shopId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(productService.getProductsByShopId(shopId, page, size),
                "Lấy danh sách sản phẩm của shop thành công");
    }

    /**
     * Lấy danh sách sản phẩm theo danh mục
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/category/{categoryId}")
    public ApiResponse<org.springframework.data.domain.Page<Product>> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(productService.getProductsByCategory(categoryId, page, size),
                "Lấy danh sách sản phẩm theo danh mục thành công");
    }

    /**
     * Tìm kiếm sản phẩm theo tên
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/search")
    public ApiResponse<org.springframework.data.domain.Page<Product>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(productService.searchProducts(keyword, page, size),
                "Tìm kiếm sản phẩm thành công");
    }

    /**
     * Lọc và sắp xếp sản phẩm nâng cao
     * Quyền hạn: Public
     * 
     * rating_desc, best_selling)
     */
    @GetMapping("/filter")
    public ApiResponse<org.springframework.data.domain.Page<Product>> filterProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(productService.filterProducts(keyword, categoryId, minPrice, maxPrice, sortBy, page, size),
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
            @RequestParam(value = "images", required = false) MultipartFile[] imageFiles) {
        try {
            Product product = new Product();
            product.setShop(new Shop());
            product.getShop().setId(shopId);
            product.setCategory(new Category());
            product.getCategory().setId(categoryId);
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStockQuantity(stockQuantity);

            // Xử lý nhiều ảnh
            if (imageFiles != null && imageFiles.length > 0) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : imageFiles) {
                    if (!file.isEmpty()) {
                        String fileName = fileStorageService.storeFile(file);
                        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/api/files/")
                                .path(fileName)
                                .toUriString();
                        imageUrls.add(url);
                    }
                }
                if (!imageUrls.isEmpty()) {
                    product.setImageUrl(imageUrls.get(0)); // Ảnh đầu tiên làm ảnh đại diện
                    product.setImages(imageUrls);
                }
            }

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
    public ApiResponse<org.springframework.data.domain.Page<Product>> getProductsByOwner(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User user = new User();
        user.setId(userId);
        return ApiResponse.success(productService.getProductsByOwner(user, page, size),
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
     * Thay đổi trạng thái sản phẩm (Admin only)
     * status: PENDING, APPROVED, REJECTED, BANNED
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ApiResponse<Product> changeProductStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ApiResponse.success(productService.changeProductStatus(id, status, reason),
                "Cập nhật trạng thái sản phẩm thành công");
    }

    /**
     * Khóa sản phẩm (Ban) - dành cho Admin
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/ban")
    public ApiResponse<Product> banProduct(@PathVariable Long id, @RequestParam String reason) {
        return ApiResponse.success(productService.banProduct(id, reason), "Khóa sản phẩm thành công");
    }

    /**
     * Mở khóa sản phẩm (Unban) - dành cho Admin
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/unban")
    public ApiResponse<Product> unbanProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.unbanProduct(id), "Mở khóa sản phẩm thành công");
    }

    /**
     * Duyệt sản phẩm - dành cho Admin
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/approve")
    public ApiResponse<Product> approveProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.approveProduct(id), "Duyệt sản phẩm thành công");
    }

    /**
     * Từ chối duyệt sản phẩm - dành cho Admin
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/reject")
    public ApiResponse<Product> rejectProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.rejectProduct(id), "Từ chối duyệt sản phẩm thành công");
    }

    /**
     * Cập nhật thông tin sản phẩm
     * Quyền hạn: SELLER (chủ sản phẩm) hoặc ADMIN
     * 
     * stockQuantity, categoryId)
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
            @RequestParam(value = "images", required = false) MultipartFile[] imageFiles) {
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

            // Xử lý nhiều ảnh mới
            if (imageFiles != null && imageFiles.length > 0) {
                List<String> imageUrls = new ArrayList<>();
                for (MultipartFile file : imageFiles) {
                    if (!file.isEmpty()) {
                        String fileName = fileStorageService.storeFile(file);
                        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                                .path("/api/files/")
                                .path(fileName)
                                .toUriString();
                        imageUrls.add(url);
                    }
                }
                if (!imageUrls.isEmpty()) {
                    product = productService.updateProductImage(id, imageUrls.get(0));
                    product.setImages(imageUrls);
                    product = productService.saveProduct(product);
                }
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

    @GetMapping("/fix-images-final")
    public ApiResponse<String> fixImagesFinal() {
        java.io.File dir = new java.io.File("C:/Users/Admin/Desktop/liennganh/uploads");
        String[] files = dir.list((d, name) -> name.endsWith(".jpg") || name.endsWith(".png"));
        if (files == null || files.length == 0)
            return ApiResponse.error(404, "No images");

        org.springframework.data.domain.Page<Product> productPage = productService.getAllProductsIncludingBanned(0,
                Integer.MAX_VALUE);
        List<Product> products = productPage.getContent();
        java.util.Random rand = new java.util.Random();
        for (Product p : products) {
            String randomImg = files[rand.nextInt(files.length)];
            String newUrl = "http://localhost:8080/api/files/" + randomImg;
            p.setImageUrl(newUrl);
            productService.updateProductImage(p.getId(), newUrl);
        }
        return ApiResponse.success("OK", "�� g�n API URL chu?n cho " + products.size() + " SP");
    }
}
