package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Cart;
import com.liennganh.shopee.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ApiResponse<Cart> getCart(@PathVariable Long userId) {
        return ApiResponse.success(cartService.getCartByUser(userId), "Cart retrieved successfully");
    }

    @PostMapping("/{userId}/add")
    public ApiResponse<Cart> addToCart(@PathVariable Long userId, @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return ApiResponse.success(cartService.addToCart(userId, productId, quantity), "Item added to cart");
    }

    @DeleteMapping("/{userId}/remove")
    public ApiResponse<Cart> removeFromCart(@PathVariable Long userId, @RequestParam Long productId) {
        return ApiResponse.success(cartService.removeFromCart(userId, productId), "Item removed from cart");
    }
}
