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

    // Đúng theo VNPay demo: hmacSHA512(key, data) - 2 tham số
    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
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
        Collections.sort(keys);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = keys.iterator();
        while (itr.hasNext()) {
            String key = itr.next();
            String value = fields.get(key);
            if (value != null && value.length() > 0) {
                sb.append(key);
                sb.append('=');
                sb.append(value);
                if (itr.hasNext()) {
                    sb.append('&');
                }
            }
        }
        return hmacSHA512(hashSecret, sb.toString());
    }
}
