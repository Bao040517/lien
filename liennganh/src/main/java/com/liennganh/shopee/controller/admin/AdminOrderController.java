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
 * Controller quáº£n lÃ½ Ä‘Æ¡n hÃ ng cho Admin
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
     * Láº¥y táº¥t cáº£ Ä‘Æ¡n hÃ ng há»‡ thá»‘ng
     */
    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return ApiResponse.success(adminOrderService.getAllOrders(), "Láº¥y danh sÃ¡ch Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
     */
    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long orderId,
            @RequestParam String status) {
        return ApiResponse.success(
                orderService.updateStatus(orderId, Order.OrderStatus.valueOf(status)),
                "Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng");
    }
}

