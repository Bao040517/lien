package com.liennganh.shopee.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseFixer {

    private final JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void fixDatabaseConstraints() {
        try {
            log.info("Attempting to drop outdated 'users_role_check' constraint...");
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            log.info("Successfully dropped 'users_role_check' constraint. New roles can now be accepted.");
        } catch (Exception e) {
            log.error("Failed to drop constraint: " + e.getMessage());
            // Consume error to not block startup if it fails for other reasons
        }
    }
}
