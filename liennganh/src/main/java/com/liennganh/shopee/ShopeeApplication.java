package com.liennganh.shopee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class ShopeeApplication {

	public static void main(String[] args) {
		SpringApplication.run(ShopeeApplication.class, args);
	}

	@Bean
	CommandLineRunner alterTableDescription(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				// Ép PostgreSQL đổi cột description từ VARCHAR(255) sang TEXT
				jdbcTemplate.execute("ALTER TABLE products ALTER COLUMN description TYPE TEXT");
				System.out.println("✅ Đã ALTER TABLE products ALTER COLUMN description TYPE TEXT thành công.");
			} catch (Exception e) {
				System.out.println(
						"⚠️ Bỏ qua ALTER TABLE: Cột description có thể đã được đổi sang TEXT hoặc database không support.");
			}

            try {
                jdbcTemplate.execute("ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check");
                System.out.println("✅ Đã DROP CONSTRAINT orders_status_check thành công để hỗ trợ trạng thái UNPAID.");
                // Tùy chọn: Thêm lại constraint mới nếu cần, hoặc để Hibernate / JPA tự quản lý ở mức code
                // jdbcTemplate.execute("ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status::text = ANY (ARRAY['UNPAID'::character varying, 'PENDING'::character varying, 'SHIPPING'::character varying, 'DELIVERING'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying]::text[]))");
            } catch (Exception e) {
                System.out.println("⚠️ Lỗi khi bỏ constraint orders_status_check: " + e.getMessage());
            }
		};
	}
}
