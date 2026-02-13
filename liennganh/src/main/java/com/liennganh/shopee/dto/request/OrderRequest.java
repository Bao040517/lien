package com.liennganh.shopee.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;
    private String voucherCode;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
