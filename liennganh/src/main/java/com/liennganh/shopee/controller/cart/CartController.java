package com.liennganh.shopee.controller.cart;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Cart;
import com.liennganh.shopee.service.order.CartService;
import com.liennganh.shopee.service.auth.JwtService;
import com.liennganh.shopee.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller quản lý giỏ hàng
 * User/Seller chỉ thao tác được giỏ hàng của chính mình, Admin xem được tất cả
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private JwtService jwtService;

    /**
     * Xem thông tin giỏ hàng
     * User/Seller chỉ xem được giỏ của mình, Admin xem được tất cả
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{userId}")
    public ApiResponse<Cart> getCart(@PathVariable Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(cartService.getCartByUser(userId), "Lấy thông tin giỏ hàng thành công");
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     * User/Seller chỉ thao tác giỏ của mình
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping("/{userId}/add")
    public ApiResponse<Cart> addToCart(@PathVariable Long userId, @RequestParam Long productId,
            @RequestParam Integer quantity) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(cartService.addToCart(userId, productId, quantity),
                "Thêm sản phẩm vào giỏ hàng thành công");
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * User/Seller chỉ thao tác giỏ của mình
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @DeleteMapping("/{userId}/remove")
    public ApiResponse<Cart> removeFromCart(@PathVariable Long userId, @RequestParam Long productId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(cartService.removeFromCart(userId, productId),
                "Xóa sản phẩm khỏi giỏ hàng thành công");
    }
}

