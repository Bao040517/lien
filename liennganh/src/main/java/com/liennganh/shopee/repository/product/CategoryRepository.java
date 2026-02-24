package com.liennganh.shopee.repository.product;

import com.liennganh.shopee.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Repository quản lý danh mục sản phẩm
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAllByOrderByIdAsc(Pageable pageable);
}
