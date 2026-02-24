package com.liennganh.shopee.service.product;

import com.liennganh.shopee.entity.Category;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.repository.product.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;

/**
 * Service quản lý danh mục sản phẩm (Category)
 */
@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Lấy tất cả danh mục (có phân trang)
     */
    public Page<Category> getAllCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return categoryRepository.findAllByOrderByIdAsc(pageable);
    }

    /**
     * Lấy danh mục theo ID
     */
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    /**
     * Tạo danh mục mới
     */
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    /**
     * Cập nhật danh mục
     */
    @Transactional
    public Category updateCategory(Long id, String name, String description, String imageUrl) {
        Category category = getCategoryById(id);
        if (name != null && !name.isBlank()) {
            category.setName(name);
        }
        if (description != null) {
            category.setDescription(description);
        }
        if (imageUrl != null) {
            category.setImageUrl(imageUrl);
        }
        return categoryRepository.save(category);
    }

    /**
     * Xoá danh mục
     */
    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
