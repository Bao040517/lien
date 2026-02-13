package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Order;
import com.liennganh.shopee.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public ApiResponse<java.util.List<Order>> getAllOrders() {
        return ApiResponse.success(orderService.getAllOrders(), "All orders retrieved successfully");
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long orderId, @RequestParam Order.OrderStatus status) {
        return ApiResponse.success(orderService.updateStatus(orderId, status), "Order status updated successfully");
    }
}
