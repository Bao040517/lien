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
 * Controller quáº£n lÃ½ sáº£n pháº©m
 * GET endpoints: Public (khÃ´ng cáº§n Ä‘Äƒng nháº­p)
 * POST/PUT/DELETE endpoints: SELLER (chá»§ shop) hoáº·c ADMIN
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Láº¥y danh sÃ¡ch sáº£n pháº©m (chÆ°a bá»‹ khÃ³a)
     * Quyá»n háº¡n: Public
     */
    @GetMapping
    public ApiResponse<List<Product>> getAllProducts() {
        return ApiResponse.success(productService.getAllProducts(), "Láº¥y danh sÃ¡ch sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y táº¥t cáº£ sáº£n pháº©m ká»ƒ cáº£ bá»‹ khÃ³a (Admin only)
     * Quyá»n háº¡n: ADMIN
     */
    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<Product>> getAllProductsAdmin() {
        return ApiResponse.success(productService.getAllProductsIncludingBanned(),
                "Láº¥y táº¥t cáº£ sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Xem chi tiáº¿t sáº£n pháº©m theo ID
     * Sáº£n pháº©m bá»‹ khÃ³a: chá»‰ ADMIN vÃ  SELLER (chá»§ sáº£n pháº©m) má»›i
     * xem Ä‘Æ°á»£c
     */
    @GetMapping("/{id}")
    public ApiResponse<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);

        // Náº¿u sáº£n pháº©m bá»‹ khÃ³a â†’ kiá»ƒm tra quyá»n xem
        if (product.isBanned()) {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();

            boolean isAdmin = false;
            boolean isOwner = false;

            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                // Kiá»ƒm tra role ADMIN
                isAdmin = auth.getAuthorities().stream()
                        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

                // Kiá»ƒm tra SELLER chá»§ sáº£n pháº©m
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

        return ApiResponse.success(product, "Láº¥y thÃ´ng tin sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch sáº£n pháº©m cá»§a má»™t shop cá»¥ thá»ƒ
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/shop/{shopId}")
    public ApiResponse<List<Product>> getProductsByShop(@PathVariable Long shopId) {
        return ApiResponse.success(productService.getProductsByShopId(shopId),
                "Láº¥y danh sÃ¡ch sáº£n pháº©m cá»§a shop thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch sáº£n pháº©m theo danh má»¥c
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ApiResponse.success(productService.getProductsByCategory(categoryId),
                "Láº¥y danh sÃ¡ch sáº£n pháº©m theo danh má»¥c thÃ nh cÃ´ng");
    }

    /**
     * TÃ¬m kiáº¿m sáº£n pháº©m theo tÃªn
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/search")
    public ApiResponse<List<Product>> searchProducts(@RequestParam String keyword) {
        return ApiResponse.success(productService.searchProducts(keyword), "TÃ¬m kiáº¿m sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Lá»c vÃ  sáº¯p xáº¿p sáº£n pháº©m nÃ¢ng cao
     * Quyá»n háº¡n: Public
     * 
     * rating_desc, best_selling)
     */
    @GetMapping("/filter")
    public ApiResponse<List<Product>> filterProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy) {
        return ApiResponse.success(productService.filterProducts(keyword, categoryId, minPrice, maxPrice, sortBy),
                "Lá»c sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o sáº£n pháº©m má»›i (chá»‰ thÃ´ng tin, khÃ´ng kÃ¨m áº£nh)
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PostMapping
    public ApiResponse<Product> createProduct(@RequestBody Product product) {
        return ApiResponse.success(productService.createProduct(product), "Táº¡o sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o sáº£n pháº©m má»›i kÃ¨m upload áº£nh
     * Quyá»n háº¡n: SELLER, ADMIN
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

            // Xá»­ lÃ½ nhiá»u áº£nh
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
                    product.setImageUrl(imageUrls.get(0)); // áº¢nh Ä‘áº§u tiÃªn lÃ m áº£nh Ä‘áº¡i diá»‡n
                    product.setImages(imageUrls);
                }
            }

            return ApiResponse.success(productService.createProduct(product),
                    "Táº¡o sáº£n pháº©m kÃ¨m áº£nh thÃ nh cÃ´ng");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lá»—i khi táº¡o sáº£n pháº©m: " + e.getMessage());
        }
    }

    /**
     * Láº¥y danh sÃ¡ch sáº£n pháº©m cá»§a shop do user hiá»‡n táº¡i quáº£n lÃ½
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @GetMapping("/my-shop")
    public ApiResponse<List<Product>> getProductsByOwner(@RequestParam Long userId) {
        User user = new User();
        user.setId(userId);
        return ApiResponse.success(productService.getProductsByOwner(user),
                "Láº¥y danh sÃ¡ch sáº£n pháº©m cá»§a shop thÃ nh cÃ´ng");
    }

    /**
     * XÃ³a sáº£n pháº©m
     * Quyá»n háº¡n: SELLER (chá»§ sáº£n pháº©m) hoáº·c ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success(null, "XÃ³a sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * KhÃ³a sáº£n pháº©m (Ban) - dÃ nh cho Admin
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/ban")
    public ApiResponse<Product> banProduct(@PathVariable Long id, @RequestParam String reason) {
        return ApiResponse.success(productService.banProduct(id, reason), "KhÃ³a sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Má»Ÿ khÃ³a sáº£n pháº©m (Unban) - dÃ nh cho Admin
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/unban")
    public ApiResponse<Product> unbanProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.unbanProduct(id), "Má»Ÿ khÃ³a sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t thÃ´ng tin sáº£n pháº©m
     * Quyá»n háº¡n: SELLER (chá»§ sáº£n pháº©m) hoáº·c ADMIN
     * 
     * stockQuantity, categoryId)
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ApiResponse.success(productService.updateProduct(id, body), "Cáº­p nháº­t sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t sáº£n pháº©m kÃ¨m upload áº£nh má»›i
     * Quyá»n háº¡n: SELLER (chá»§ sáº£n pháº©m) hoáº·c ADMIN
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

            // Xá»­ lÃ½ nhiá»u áº£nh má»›i
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

            return ApiResponse.success(product, "Cáº­p nháº­t sáº£n pháº©m thÃ nh cÃ´ng");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lá»—i khi cáº­p nháº­t sáº£n pháº©m: " + e.getMessage());
        }
    }

    // ========== THUá»˜C TÃNH Sáº¢N PHáº¨M (ATTRIBUTES) ==========

    /**
     * Láº¥y danh sÃ¡ch thuá»™c tÃ­nh cá»§a sáº£n pháº©m
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/{productId}/attributes")
    public ApiResponse<List<ProductAttribute>> getProductAttributes(@PathVariable Long productId) {
        return ApiResponse.success(productService.getProductAttributes(productId),
                "Láº¥y danh sÃ¡ch thuá»™c tÃ­nh thÃ nh cÃ´ng");
    }

    /**
     * ThÃªm thuá»™c tÃ­nh má»›i cho sáº£n pháº©m
     * Quyá»n háº¡n: SELLER, ADMIN (Cáº§n bá»• sung Authorization sau)
     * 
     */
    @PostMapping("/{productId}/attributes")
    public ApiResponse<ProductAttribute> addAttribute(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body) {
        return ApiResponse.success(productService.addAttribute(productId, (String) body.get("name")),
                "ThÃªm thuá»™c tÃ­nh thÃ nh cÃ´ng");
    }

    /**
     * ThÃªm tÃ¹y chá»n (option) cho thuá»™c tÃ­nh
     * Quyá»n háº¡n: SELLER, ADMIN (Cáº§n bá»• sung Authorization sau)
     * 
     */
    @PostMapping("/attributes/{attributeId}/options")
    public ApiResponse<ProductAttributeOption> addOption(
            @PathVariable Long attributeId,
            @RequestBody Map<String, Object> body) {
        return ApiResponse.success(
                productService.addOption(attributeId, (String) body.get("value"), (String) body.get("imageUrl")),
                "ThÃªm tÃ¹y chá»n thÃ nh cÃ´ng");
    }

    // ========== BIáº¾N THá»‚ Sáº¢N PHáº¨M (VARIANTS) ==========

    /**
     * Láº¥y danh sÃ¡ch biáº¿n thá»ƒ cá»§a sáº£n pháº©m
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/{productId}/variants")
    public ApiResponse<List<ProductVariant>> getVariants(@PathVariable Long productId) {
        return ApiResponse.success(productService.getVariants(productId), "Láº¥y danh sÃ¡ch biáº¿n thá»ƒ thÃ nh cÃ´ng");
    }

    /**
     * ThÃªm biáº¿n thá»ƒ má»›i cho sáº£n pháº©m
     * Quyá»n háº¡n: SELLER, ADMIN (Cáº§n bá»• sung Authorization sau)
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
                "ThÃªm biáº¿n thá»ƒ thÃ nh cÃ´ng");
    }

    /**
     * XÃ³a biáº¿n thá»ƒ
     * Quyá»n háº¡n: SELLER, ADMIN (Cáº§n bá»• sung Authorization sau)
     * 
     */
    @DeleteMapping("/variants/{variantId}")
    public ApiResponse<Void> deleteVariant(@PathVariable Long variantId) {
        productService.deleteVariant(variantId);
        return ApiResponse.success(null, "XÃ³a biáº¿n thá»ƒ thÃ nh cÃ´ng");
    }

    @GetMapping("/fix-images-final")
    public ApiResponse<String> fixImagesFinal() {
        java.io.File dir = new java.io.File("C:/Users/Admin/Desktop/liennganh/uploads");
        String[] files = dir.list((d, name) -> name.endsWith(".jpg") || name.endsWith(".png"));
        if (files == null || files.length == 0)
            return ApiResponse.error(404, "No images");

        List<Product> products = productService.getAllProductsIncludingBanned();
        java.util.Random rand = new java.util.Random();
        for (Product p : products) {
            String randomImg = files[rand.nextInt(files.length)];
            String newUrl = "http://localhost:8080/api/files/" + randomImg;
            p.setImageUrl(newUrl);
            productService.updateProductImage(p.getId(), newUrl);
        }
        return ApiResponse.success("OK", "Đã gán API URL chuẩn cho " + products.size() + " SP");
    }
}
