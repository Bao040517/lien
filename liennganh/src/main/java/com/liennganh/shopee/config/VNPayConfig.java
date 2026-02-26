package com.liennganh.shopee.config;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class VNPayConfig {
    @Value("${vnpay.tmn-code}")
    public String tmnCode;
    @Value("${vnpay.hash-secret}")
    public String hashSecret;
    @Value("${vnpay.pay-url}")
    public String payUrl;
    @Value("${vnpay.return-url}")
    public String returnUrl;

    public String hmacSHA512(String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec key = new SecretKeySpec(
                    hashSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(key);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("HMAC error", e);
        }
    }

    public String hashAllFields(Map<String, String> fields) {
        List<String> keys = new ArrayList<>(fields.keySet());
        Collections.sort(keys); // Sort A→Z
        StringBuilder sb = new StringBuilder();
        for (String key : keys) {
            String value = fields.get(key);
            if (value != null && !value.isEmpty()) {
                if (sb.length() > 0)
                    sb.append('&');
                sb.append(key).append('=').append(value);
            }
        }
        return hmacSHA512(sb.toString());
    }

}
