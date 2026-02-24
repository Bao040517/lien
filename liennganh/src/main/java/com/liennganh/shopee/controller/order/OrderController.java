package com.liennganh.shopee.controller.order;

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
 * Controller quáº£n lÃ½ Ä‘Æ¡n hÃ ng
 * User/Seller chá»‰ xem Ä‘Æ°á»£c Ä‘Æ¡n hÃ ng cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private JwtService jwtService;

    /**
     * Táº¡o Ä‘Æ¡n hÃ ng má»›i
     * Quyá»n háº¡n: USER, SELLER
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody com.liennganh.shopee.dto.request.OrderRequest orderRequest) {
        // Validate request
        if (orderRequest.getUserId() == null) {
            throw new com.liennganh.shopee.exception.AppException(
                    com.liennganh.shopee.exception.ErrorCode.INVALID_INPUT);
        }
        if (orderRequest.getItems() == null || orderRequest.getItems().isEmpty()) {
            throw new com.liennganh.shopee.exception.AppException(
                    com.liennganh.shopee.exception.ErrorCode.INVALID_INPUT);
        }

        // Äáº£m báº£o user chá»‰ táº¡o Ä‘Æ¡n cho chÃ­nh mÃ¬nh
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(orderRequest.getUserId(), currentUserId);

        List<OrderItem> items = orderRequest.getItems().stream().map(dtoItem -> {
            if (dtoItem.getProductId() == null) {
                throw new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.INVALID_INPUT);
            }
            if (dtoItem.getQuantity() == null || dtoItem.getQuantity() <= 0) {
                throw new com.liennganh.shopee.exception.AppException(
                        com.liennganh.shopee.exception.ErrorCode.INVALID_QUANTITY);
            }
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
                "Táº¡o Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * Xem lá»‹ch sá»­ Ä‘Æ¡n hÃ ng
     * User/Seller chá»‰ xem Ä‘Æ°á»£c Ä‘Æ¡n cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrderHistory(@PathVariable Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(orderService.getOrdersByUser(userId), "Láº¥y lá»‹ch sá»­ Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * Xem chi tiáº¿t má»™t Ä‘Æ¡n hÃ ng
     * User chá»‰ xem Ä‘Æ°á»£c Ä‘Æ¡n cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{orderId}")
    public ApiResponse<Order> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        // Kiá»ƒm tra quyá»n sá»Ÿ há»¯u Ä‘Æ¡n hÃ ng
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(order.getUser().getId(), currentUserId);
        return ApiResponse.success(order, "Láº¥y thÃ´ng tin Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng
     * Quyá»n háº¡n: SELLER, ADMIN
     */
    @PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
    @PutMapping("/{orderId}/status")
    public ApiResponse<Order> updateOrderStatus(@PathVariable Long orderId,
            @RequestBody java.util.Map<String, String> request) {
        String status = request.get("status");
        return ApiResponse.success(
                orderService.updateStatus(orderId, Order.OrderStatus.valueOf(status)),
                "Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng");
    }
}

