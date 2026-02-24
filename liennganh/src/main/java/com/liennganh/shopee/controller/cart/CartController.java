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
 * Controller quáº£n lÃ½ giá» hÃ ng
 * User/Seller chá»‰ thao tÃ¡c Ä‘Æ°á»£c giá» hÃ ng cá»§a chÃ­nh mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;
    @Autowired
    private JwtService jwtService;

    /**
     * Xem thÃ´ng tin giá» hÃ ng
     * User/Seller chá»‰ xem Ä‘Æ°á»£c giá» cá»§a mÃ¬nh, Admin xem Ä‘Æ°á»£c táº¥t cáº£
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @GetMapping("/{userId}")
    public ApiResponse<Cart> getCart(@PathVariable Long userId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(cartService.getCartByUser(userId), "Láº¥y thÃ´ng tin giá» hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * ThÃªm sáº£n pháº©m vÃ o giá» hÃ ng
     * User/Seller chá»‰ thao tÃ¡c giá» cá»§a mÃ¬nh
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @PostMapping("/{userId}/add")
    public ApiResponse<Cart> addToCart(@PathVariable Long userId, @RequestParam Long productId,
            @RequestParam Integer quantity) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(cartService.addToCart(userId, productId, quantity),
                "ThÃªm sáº£n pháº©m vÃ o giá» hÃ ng thÃ nh cÃ´ng");
    }

    /**
     * XÃ³a sáº£n pháº©m khá»i giá» hÃ ng
     * User/Seller chá»‰ thao tÃ¡c giá» cá»§a mÃ¬nh
     */
    @PreAuthorize("hasAnyRole('USER', 'SELLER')")
    @DeleteMapping("/{userId}/remove")
    public ApiResponse<Cart> removeFromCart(@PathVariable Long userId, @RequestParam Long productId) {
        Long currentUserId = SecurityUtils.getCurrentUserId(jwtService);
        SecurityUtils.validateOwnership(userId, currentUserId);
        return ApiResponse.success(cartService.removeFromCart(userId, productId),
                "XÃ³a sáº£n pháº©m khá»i giá» hÃ ng thÃ nh cÃ´ng");
    }
}

