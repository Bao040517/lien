package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Order;
import com.liennganh.shopee.entity.OrderItem;
import com.liennganh.shopee.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller quản lý đơn hàng
 * Hỗ trợ các chức năng mua hàng, xem lịch sử và cập nhật trạng thái
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    /**
     * Tạo đơn hàng mới
     * Dành cho User (Khách hàng) hoặc Seller (Người bán cũng có thể mua hàng)
     * Quyền hạn: USER, SELLER
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody com.liennganh.shopee.dto.request.OrderRequest orderRequest) {
        // Chuyển đổi từ DTO sang entity OrderItem
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
     * Xem lịch sử đơn hàng của người dùng
     * Quyền hạn: USER (chính chủ), SELLER (xem đơn mua của mình), ADMIN (quản lý)
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrderHistory(@PathVariable Long userId) {
        return ApiResponse.success(orderService.getOrdersByUser(userId), "Lấy lịch sử đơn hàng thành công");
    }

    /**
     * Xem chi tiết một đơn hàng theo ID
     * Quyền hạn: USER (chủ đơn), SELLER (shop có sản phẩm trong đơn), ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{orderId}")
    public ApiResponse<Order> getOrderById(@PathVariable Long orderId) {
        return ApiResponse.success(orderService.getOrderById(orderId), "Lấy thông tin đơn hàng thành công");
    }

    /**
     * Cập nhật trạng thái đơn hàng
     * Dành cho Seller (xử lý đơn hàng của shop mình) hoặc Admin
     * Quyền hạn: SELLER, ADMIN
     * 
     *                SHIPPING, DELIVERED, CANCELLED)
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long orderId,
            @RequestBody java.util.Map<String, String> request) {
        String status = request.get("status");
        return ApiResponse.success(
                orderService.updateStatus(orderId, Order.OrderStatus.valueOf(status)),
                "Cập nhật trạng thái đơn hàng thành công");
    }
}
