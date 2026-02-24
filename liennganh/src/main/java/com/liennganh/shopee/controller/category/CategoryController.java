package com.liennganh.shopee.controller.category;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Category;
import com.liennganh.shopee.service.product.CategoryService;
import com.liennganh.shopee.service.common.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Controller quáº£n lÃ½ danh má»¥c sáº£n pháº©m
 * GET: Public | POST/PUT/DELETE: ADMIN
 */
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Láº¥y danh sÃ¡ch táº¥t cáº£ danh má»¥c
     * Quyá»n háº¡n: Public
     */
    @GetMapping
    public ApiResponse<List<Category>> getAllCategories() {
        return ApiResponse.success(categoryService.getAllCategories(), "Láº¥y danh sÃ¡ch danh má»¥c thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o danh má»¥c má»›i (JSON, khÃ´ng áº£nh)
     * Quyá»n háº¡n: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<Category> createCategory(@RequestBody Category category) {
        return ApiResponse.success(categoryService.createCategory(category), "Táº¡o danh má»¥c thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o danh má»¥c má»›i kÃ¨m upload áº£nh
     * Quyá»n háº¡n: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Category> createCategoryWithImage(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            Category category = new Category();
            category.setName(name);
            category.setDescription(description);

            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = fileStorageService.storeFile(imageFile);
                String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/files/")
                        .path(fileName)
                        .toUriString();
                category.setImageUrl(imageUrl);
            }

            return ApiResponse.success(categoryService.createCategory(category), "Táº¡o danh má»¥c kÃ¨m áº£nh thÃ nh cÃ´ng");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lá»—i khi táº¡o danh má»¥c: " + e.getMessage());
        }
    }

    /**
     * Cáº­p nháº­t danh má»¥c (kÃ¨m áº£nh náº¿u cÃ³)
     * Quyá»n háº¡n: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Category> updateCategory(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            String imageUrl = null;
            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = fileStorageService.storeFile(imageFile);
                imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/api/files/")
                        .path(fileName)
                        .toUriString();
            }

            Category updated = categoryService.updateCategory(id, name, description, imageUrl);
            return ApiResponse.success(updated, "Cáº­p nháº­t danh má»¥c thÃ nh cÃ´ng");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lá»—i khi cáº­p nháº­t danh má»¥c: " + e.getMessage());
        }
    }

    /**
     * XoÃ¡ danh má»¥c
     * Quyá»n háº¡n: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success(null, "XoÃ¡ danh má»¥c thÃ nh cÃ´ng");
    }
}

