package com.liennganh.shopee.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * One-time migration: chuyển dữ liệu từ is_banned + is_approved →
 * product_status
 * Chạy khi khởi động server. An toàn để chạy nhiều lần (idempotent).
 */
@Component
public class ProductStatusMigration {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void migrate() {
        // Bước 1: Migrate dữ liệu (nếu cột cũ còn tồn tại)
        try {
            Boolean isBannedExists = jdbcTemplate.queryForObject(
                    "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_banned')",
                    Boolean.class);

            if (Boolean.TRUE.equals(isBannedExists)) {
                Boolean productStatusExists = jdbcTemplate.queryForObject(
                        "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'product_status')",
                        Boolean.class);

                if (!Boolean.TRUE.equals(productStatusExists)) {
                    jdbcTemplate
                            .execute("ALTER TABLE products ADD COLUMN product_status varchar(20) DEFAULT 'PENDING'");
                }

                Boolean isApprovedExists = jdbcTemplate.queryForObject(
                        "SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_approved')",
                        Boolean.class);

                if (Boolean.TRUE.equals(isApprovedExists)) {
                    jdbcTemplate.execute(
                            "UPDATE products SET product_status = CASE " +
                                    "WHEN is_banned = true THEN 'BANNED' " +
                                    "WHEN is_approved = true THEN 'APPROVED' " +
                                    "ELSE 'PENDING' END " +
                                    "WHERE product_status IS NULL OR product_status = 'PENDING'");
                    jdbcTemplate.execute("ALTER TABLE products DROP COLUMN is_approved");
                    System.out.println("[Migration] Dropped is_approved column");
                } else {
                    jdbcTemplate.execute(
                            "UPDATE products SET product_status = CASE " +
                                    "WHEN is_banned = true THEN 'BANNED' " +
                                    "ELSE 'PENDING' END " +
                                    "WHERE product_status IS NULL OR product_status = 'PENDING'");
                }

                jdbcTemplate.execute("ALTER TABLE products DROP COLUMN is_banned");
                System.out.println("[Migration] Dropped is_banned column, product_status is now the source of truth");
            }
        } catch (Exception e) {
            System.out.println("[Migration] Data migration skipped: " + e.getMessage());
        }

        // Bước 2: Luôn xóa cột cũ (IF EXISTS đảm bảo an toàn khi chạy nhiều lần)
        try {
            jdbcTemplate.execute("ALTER TABLE products DROP COLUMN IF EXISTS is_banned");
            jdbcTemplate.execute("ALTER TABLE products DROP COLUMN IF EXISTS is_approved");
            System.out.println("[Migration] Dropped old columns is_banned/is_approved (if existed)");
        } catch (Exception e) {
            System.out.println("[Migration] Drop columns skipped: " + e.getMessage());
        }
    }
}
