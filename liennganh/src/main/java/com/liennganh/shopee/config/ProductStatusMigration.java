package com.liennganh.shopee.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * One-time migration: chuyển dữ liệu từ is_banned + is_approved → product_status
 * Chạy khi khởi động server. An toàn để chạy nhiều lần (idempotent).
 */
@Component
public class ProductStatusMigration {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrate() {
        try {
            Boolean columnExists = jdbcTemplate.queryForObject(
                "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_banned')",
                Boolean.class
            );

            if (Boolean.TRUE.equals(columnExists)) {
                jdbcTemplate.execute(
                    "UPDATE products SET product_status = CASE " +
                    "WHEN is_banned = true THEN 'BANNED' " +
                    "WHEN is_approved = true THEN 'APPROVED' " +
                    "ELSE 'PENDING' END " +
                    "WHERE product_status IS NULL OR product_status = 'PENDING'"
                );
                System.out.println("[Migration] product_status migrated from is_banned/is_approved");
            }
        } catch (Exception e) {
            System.out.println("[Migration] Skipped: " + e.getMessage());
        }
    }
}
