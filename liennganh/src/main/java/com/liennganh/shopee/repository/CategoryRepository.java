package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
