package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Cart;
import com.liennganh.shopee.service.order.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Controller quản lý giỏ hàng
 * Cung cấp các API để xem, thêm và xóa sản phẩm khỏi giỏ hàng
 * Yêu cầu đăng nhập để sử dụng
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    /**
     * Xem thông tin giỏ hàng của người dùng
     * Quyền hạn: USER (chính chủ), SELLER
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @GetMapping("/{userId}")
    public ApiResponse<Cart> getCart(@PathVariable Long userId) {
        return ApiResponse.success(cartService.getCartByUser(userId), "Lấy thông tin giỏ hàng thành công");
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     * Quyền hạn: USER, SELLER
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping("/{userId}/add")
    public ApiResponse<Cart> addToCart(@PathVariable Long userId, @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return ApiResponse.success(cartService.addToCart(userId, productId, quantity),
                "Thêm sản phẩm vào giỏ hàng thành công");
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * Quyền hạn: USER, SELLER
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @DeleteMapping("/{userId}/remove")
    public ApiResponse<Cart> removeFromCart(@PathVariable Long userId, @RequestParam Long productId) {
        return ApiResponse.success(cartService.removeFromCart(userId, productId),
                "Xóa sản phẩm khỏi giỏ hàng thành công");
    }
}
