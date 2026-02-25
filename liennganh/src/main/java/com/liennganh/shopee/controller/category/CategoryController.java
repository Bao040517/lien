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
 * Controller quản lý danh mục sản phẩm
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
     * Lấy danh sách tất cả danh mục
     * Quyền hạn: Public
     */
    @GetMapping
    public ApiResponse<org.springframework.data.domain.Page<Category>> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size) {
        return ApiResponse.success(categoryService.getAllCategories(page, size),
                "Lấy danh sách danh mục thành công");
    }

    /**
     * Tạo danh mục mới (JSON, không ảnh)
     * Quyền hạn: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<Category> createCategory(@RequestBody Category category) {
        return ApiResponse.success(categoryService.createCategory(category), "Tạo danh mục thành công");
    }

    /**
     * Tạo danh mục mới kèm upload ảnh
     * Quyền hạn: ADMIN
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

            return ApiResponse.success(categoryService.createCategory(category),
                    "Tạo danh mục kèm ảnh thành công");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lỗi khi tạo danh mục: " + e.getMessage());
        }
    }

    /**
     * Cập nhật danh mục (kèm ảnh nếu có)
     * Quyền hạn: ADMIN
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
            return ApiResponse.success(updated, "Cập nhật danh mục thành công");
        } catch (Exception e) {
            return ApiResponse.error(500, "Lỗi khi cập nhật danh mục: " + e.getMessage());
        }
    }

    /**
     * Xoá danh mục
     * Quyền hạn: ADMIN
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ApiResponse.success(null, "Xoá danh mục thành công");
    }
}
