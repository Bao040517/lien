package com.liennganh.shopee.service.order;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.repository.order.CartRepository;
import com.liennganh.shopee.repository.product.ProductRepository;
import com.liennganh.shopee.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service quản lý giỏ hàng
 * Mỗi user có 1 giỏ hàng duy nhất
 */
@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy giỏ hàng của user
     * Nếu chưa có thì tạo mới
     * 
     */
    public Cart getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    /**
     * Xóa danh sách sản phẩm khỏi giỏ hàng (Sau khi đặt hàng thành công)
     * 
     */
    @Transactional
    public void removeProducts(Long userId, List<Long> productIds) {
        Cart cart = getCartByUser(userId);
        boolean removed = cart.getItems().removeIf(item -> productIds.contains(item.getProduct().getId()));
        if (removed) {
            updateCartTotal(cart); // Cập nhật lại tổng tiền
            cartRepository.save(cart);
        }
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     * N?u s?n ph?m d� c� -> c?p nh?t s? lu?ng
     * 
     */
    @Transactional
    public Cart addToCart(Long userId, Long productId, Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }
        Cart cart = getCartByUser(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Ki?m tra xem s?n ph?m d� c� trong gi? h�ng chua
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
        }

        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    /**
     * Xóa 1 sản phẩm khỏi giỏ hàng
     * 
     */
    @Transactional
    public Cart removeFromCart(Long userId, Long productId) {
        Cart cart = getCartByUser(userId);
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    /**
     * Tính lại tổng tiền giỏ hàng
     */
    private void updateCartTotal(Cart cart) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            BigDecimal itemPrice = item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemPrice);
        }
        cart.setTotalPrice(total);
    }
}
