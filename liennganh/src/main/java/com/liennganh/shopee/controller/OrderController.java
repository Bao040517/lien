package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Order;
import com.liennganh.shopee.entity.OrderItem;
import com.liennganh.shopee.service.order.OrderService;
import com.liennganh.shopee.service.auth.JwtService;
import com.liennganh.shopee.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý đơn hàng
 * User/Seller chỉ xem được đơn hàng của mình, Admin xem được tất cả
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private JwtService jwtService;

    /**
     * Tạo đơn hàng mới
     * Quyền hạn: USER, SELLER
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody com.liennganh.shopee.dto.request.OrderRequest orderRequest) {
        // Đảm bảo user chỉ tạo đơn cho chính mình
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(orderRequest.getUserId(), currentUserId);

        List<OrderItem> items = orderRequest.getItems().stream().map(dtoItem -> {
            OrderItem item = new OrderItem();
            com.liennganh.shopee.entity.Product p = new com.liennganh.shopee.entity.Product();
            p.setId(dtoItem.getProductId());
            item.setProduct(p);
            item.setQuantity(dtoItem.getQuantity());
            return item;
        }).toList();

        return ApiResponse.success(orderService.createOrder(
                orderRequest.getUserId(),
                items,
                orderRequest.getVoucherCode(),
                orderRequest.getAddressId(),
                orderRequest.getPaymentMethod()),
                "Tạo đơn hàng thành công");
    }

    /**
     * Xem lịch sử đơn hàng
     * User/Seller chỉ xem được đơn của mình, Admin xem được tất cả
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrderHistory(@PathVariable Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(orderService.getOrdersByUser(userId), "Lấy lịch sử đơn hàng thành công");
    }

    /**
     * Xem chi tiết một đơn hàng
     * User chỉ xem được đơn của mình, Admin xem được tất cả
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{orderId}")
    public ApiResponse<Order> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        // Kiểm tra quyền sở hữu đơn hàng
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(order.getUser().getId(), currentUserId);
        return ApiResponse.success(order, "Lấy thông tin đơn hàng thành công");
    }

    /**
     * Cập nhật trạng thái đơn hàng
     * Quyền hạn: SELLER, ADMIN
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long orderId,
            @RequestBody java.util.Map<String, String> request) {
        String status = request.get("status");
        return ApiResponse.success(
                orderService.updateStatus(orderId, Order.OrderStatus.valueOf(status)),
                "Cập nhật trạng thái đơn hàng thành công");
    }
}
