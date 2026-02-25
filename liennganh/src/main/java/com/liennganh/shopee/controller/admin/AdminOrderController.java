package com.liennganh.shopee.controller.admin;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Order;
import com.liennganh.shopee.service.admin.AdminOrderService;
import com.liennganh.shopee.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

/**
 * Controller quản lý đơn hàng cho Admin
 * Permission: ADMIN only
 */
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final AdminOrderService adminOrderService;
    private final OrderService orderService;

    /**
     * Lấy tất cả đơn hàng hệ thống
     */
    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.success(adminOrderService.getAllOrders(), "Lấy danh sách đơn hàng thành công");
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long orderId,
            @RequestParam String status) {
        return ApiResponse.success(
                orderService.updateStatus(orderId, Order.OrderStatus.valueOf(status)),
                "Cập nhật trạng thái đơn hàng thành công");
    }
}

