package com.project.shopapp.components;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomHealthCheck implements HealthIndicator {

    @Override
    public Health health() {
        try {
            Map<String, Object> details = new HashMap<>();
            String computerName = InetAddress.getLocalHost().getHostName();
            details.put("computerName", String.format("computerName: %s", computerName));
            return Health.up().withDetails(details).build();
        } catch (Exception e) {
            return Health.down()
                    .withDetail("Error", e.getMessage()).build();
        }
    }
}