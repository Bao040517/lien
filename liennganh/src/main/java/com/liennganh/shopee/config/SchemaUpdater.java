package com.liennganh.shopee.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaUpdater implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE");
            jdbcTemplate.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS violation_reason VARCHAR(255)");

            // Create notifications table if not exists
            jdbcTemplate.execute("""
                        CREATE TABLE IF NOT EXISTS notifications (
                            id BIGSERIAL PRIMARY KEY,
                            user_id BIGINT NOT NULL,
                            title VARCHAR(255),
                            message TEXT,
                            type VARCHAR(50),
                            is_read BOOLEAN DEFAULT FALSE,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            related_url VARCHAR(255),
                            CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
                        )
                    """);

            System.out.println("Schema updated successfully.");
        } catch (Exception e) {
            System.err.println("Schema update failed: " + e.getMessage());
        }
    }
}
