package com.liennganh.shopee.dto.request;

import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO cho yêu cầu tạo/cập nhật sản phẩm
 */
@Data
public class ProductRequest {
    private Long shopId; // ID shop bán (thường lấy từ user đang login)
    private Long categoryId; // ID danh mục
    private String name; // Tên sản phẩm
    private String description;// Mô tả sản phẩm
    private BigDecimal price; // Giá bán
    private Integer stockQuantity; // Số lượng tồn
    private Integer discountPercentage; // % Giảm giá
    private String imageUrl; // Link ảnh
}
