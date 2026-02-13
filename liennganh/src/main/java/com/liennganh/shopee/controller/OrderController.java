package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Order;
import com.liennganh.shopee.model.OrderItem;
import com.liennganh.shopee.service.OrderService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        return ApiResponse.success(orderService.createOrder(orderRequest.getUserId(), orderRequest.getItems(),
                orderRequest.getVoucherCode(), orderRequest.getAddressId(), orderRequest.getPaymentMethod()),
                "Order created successfully");
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrderHistory(@PathVariable Long userId) {
        return ApiResponse.success(orderService.getOrdersByUser(userId), "Order history retrieved successfully");
    }

    @GetMapping("/{orderId}")
    public ApiResponse<Order> getOrderById(@PathVariable Long orderId) {
        return ApiResponse.success(orderService.getOrderById(orderId), "Order retrieved successfully");
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long orderId, @RequestBody StatusUpdateRequest request) {
        return ApiResponse.success(
                orderService.updateStatus(orderId, Order.OrderStatus.valueOf(request.getStatus())),
                "Order status updated successfully");
    }

    @Data
    public static class OrderRequest {
        private Long userId;
        private List<OrderItem> items;
        private String voucherCode;
        private Long addressId;
        private String paymentMethod;
    }

    @Data
    public static class StatusUpdateRequest {
        private String status;
    }
}
