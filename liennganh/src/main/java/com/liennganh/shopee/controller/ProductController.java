package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.*;
import com.liennganh.shopee.service.ProductService;
import com.liennganh.shopee.service.FileStorageService;
import com.liennganh.shopee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;
    @Autowired
    private com.liennganh.shopee.repository.UserRepository userRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private ShopRepository shopRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductAttributeRepository attributeRepository;
    @Autowired
    private ProductAttributeOptionRepository optionRepository;
    @Autowired
    private ProductVariantRepository variantRepository;

    @GetMapping
    public ApiResponse<List<Product>> getAllProducts() {
        return ApiResponse.success(productService.getAllProducts(), "Products retrieved successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<Product> getProductById(@PathVariable Long id) {
        return ApiResponse.success(productService.getProductById(id), "Product retrieved successfully");
    }

    @GetMapping("/shop/{shopId}")
    public ApiResponse<List<Product>> getProductsByShop(@PathVariable Long shopId) {
        return ApiResponse.success(productService.getProductsByShopId(shopId), "Shop products retrieved successfully");
    }

    @GetMapping("/category/{categoryId}")
    public ApiResponse<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ApiResponse.success(productService.getProductsByCategory(categoryId), "Products retrieved successfully");
    }

    @GetMapping("/search")
    public ApiResponse<List<Product>> searchProducts(@RequestParam String keyword) {
        return ApiResponse.success(productService.searchProducts(keyword), "Products retrieved successfully");
    }

    @GetMapping("/filter")
    public ApiResponse<List<Product>> filterProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String sortBy) {
        return ApiResponse.success(productService.filterProducts(keyword, categoryId, minPrice, maxPrice, sortBy),
                "Products filtered successfully");
    }

    @PostMapping
    public ApiResponse<Product> createProduct(@RequestBody Product product) {
        if (product.getShop() != null && product.getShop().getId() != null) {
            Shop shop = shopRepository.findById(product.getShop().getId())
                    .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                            com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
            product.setShop(shop);
        }
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }
        return ApiResponse.success(productService.createProduct(product), "Product created successfully");
    }

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

            Shop shop = shopRepository.findById(shopId)
                    .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                            com.liennganh.shopee.exception.ErrorCode.SHOP_NOT_FOUND));
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            Product product = new Product();
            product.setShop(shop);
            product.setCategory(category);
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStockQuantity(stockQuantity);
            product.setImageUrl(imageUrl);

            return ApiResponse.success(productService.createProduct(product),
                    "Product created with image successfully");
        } catch (Exception e) {
            return ApiResponse.error(500, "Failed to create product: " + e.getMessage());
        }
    }

    @GetMapping("/my-shop")
    public ApiResponse<List<Product>> getProductsByOwner(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.USER_NOT_FOUND));
        return ApiResponse.success(productService.getProductsByOwner(user), "Products retrieved successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ApiResponse.success(null, "Product deleted successfully");
    }

    @PutMapping("/{id}/ban")
    public ApiResponse<Product> banProduct(@PathVariable Long id, @RequestParam String reason) {
        return ApiResponse.success(productService.banProduct(id, reason), "Product banned successfully");
    }

    @PutMapping("/{id}/unban")
    public ApiResponse<Product> unbanProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.unbanProduct(id), "Product unbanned successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<Product> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Product product = productService.getProductById(id);
        if (body.containsKey("name"))
            product.setName((String) body.get("name"));
        if (body.containsKey("description"))
            product.setDescription((String) body.get("description"));
        if (body.containsKey("price"))
            product.setPrice(new BigDecimal(body.get("price").toString()));
        if (body.containsKey("stockQuantity"))
            product.setStockQuantity(Integer.parseInt(body.get("stockQuantity").toString()));
        return ApiResponse.success(productService.createProduct(product), "Product updated successfully");
    }

    // ========== PRODUCT ATTRIBUTES (Seller tự tạo thuộc tính) ==========

    @GetMapping("/{productId}/attributes")
    public ApiResponse<List<ProductAttribute>> getProductAttributes(@PathVariable Long productId) {
        return ApiResponse.success(attributeRepository.findByProductId(productId), "Attributes retrieved");
    }

    @PostMapping("/{productId}/attributes")
    public ApiResponse<ProductAttribute> addAttribute(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body) {
        Product product = productService.getProductById(productId);
        ProductAttribute attr = new ProductAttribute();
        attr.setProduct(product);
        attr.setName((String) body.get("name"));
        return ApiResponse.success(attributeRepository.save(attr), "Attribute added");
    }

    @PostMapping("/attributes/{attributeId}/options")
    public ApiResponse<ProductAttributeOption> addOption(
            @PathVariable Long attributeId,
            @RequestBody Map<String, Object> body) {
        ProductAttribute attr = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException("Attribute not found"));
        ProductAttributeOption option = new ProductAttributeOption();
        option.setAttribute(attr);
        option.setValue((String) body.get("value"));
        option.setImageUrl((String) body.get("imageUrl"));
        return ApiResponse.success(optionRepository.save(option), "Option added");
    }

    // ========== PRODUCT VARIANTS ==========

    @GetMapping("/{productId}/variants")
    public ApiResponse<List<ProductVariant>> getVariants(@PathVariable Long productId) {
        return ApiResponse.success(variantRepository.findByProductId(productId), "Variants retrieved");
    }

    @PostMapping("/{productId}/variants")
    public ApiResponse<ProductVariant> addVariant(
            @PathVariable Long productId,
            @RequestBody Map<String, Object> body) {
        Product product = productService.getProductById(productId);
        ProductVariant variant = new ProductVariant();
        variant.setProduct(product);
        variant.setAttributes(body.get("attributes").toString());
        variant.setPrice(new BigDecimal(body.get("price").toString()));
        variant.setStockQuantity(Integer.parseInt(body.get("stockQuantity").toString()));
        variant.setImageUrl((String) body.get("imageUrl"));
        return ApiResponse.success(variantRepository.save(variant), "Variant added");
    }

    @DeleteMapping("/variants/{variantId}")
    public ApiResponse<Void> deleteVariant(@PathVariable Long variantId) {
        variantRepository.deleteById(variantId);
        return ApiResponse.success(null, "Variant deleted");
    }
}
