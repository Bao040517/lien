package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.*;
import com.liennganh.shopee.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private AddressRepository addressRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Autowired
    private VoucherService voucherService;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order createOrder(Long userId, List<OrderItem> items, String voucherCode, Long addressId,
            String paymentMethod) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setOrderItems(items);

        try {
            order.setPaymentMethod(
                    paymentMethod != null ? Order.PaymentMethod.valueOf(paymentMethod) : Order.PaymentMethod.COD);
        } catch (IllegalArgumentException e) {
            order.setPaymentMethod(Order.PaymentMethod.COD);
        }

        if (addressId != null) {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
            // Optional: Check if address belongs to user
            if (!address.getUser().getId().equals(userId)) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            order.setShippingAddress(address);
        }

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItem item : items) {
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            if (product.getStockQuantity() < item.getQuantity()) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            // Update stock
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            item.setPrice(product.getPrice());
            item.setOrder(order);
            item.setProduct(product);

            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalPrice = totalPrice.add(itemTotal);
        }

        order.setTotalPrice(totalPrice);
        order.setFinalPrice(totalPrice);

        if (voucherCode != null && !voucherCode.isEmpty()) {
            Voucher voucher = voucherService.getVoucherByCode(voucherCode)
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

            if (voucherService.isValid(voucher)) {
                if (voucher.getMinOrderValue() == null || totalPrice.compareTo(voucher.getMinOrderValue()) >= 0) {
                    BigDecimal discount = BigDecimal.ZERO;
                    if (voucher.getDiscountType() == Voucher.DiscountType.FIXED) {
                        discount = voucher.getDiscountValue();
                    } else {
                        discount = totalPrice.multiply(voucher.getDiscountValue().divide(BigDecimal.valueOf(100)));
                    }

                    BigDecimal finalPrice = totalPrice.subtract(discount);
                    order.setFinalPrice(finalPrice.max(BigDecimal.ZERO));
                    order.setVoucher(voucher);
                    voucherService.decreaseUsage(voucher);
                } else {
                    throw new AppException(ErrorCode.INVALID_VOUCHER_CODE);
                }
            } else {
                throw new AppException(ErrorCode.INVALID_VOUCHER_CODE);
            }
        }

        Order savedOrder = orderRepository.save(order);

        // Remove from cart
        List<Long> productIds = items.stream().map(item -> item.getProduct().getId()).toList();
        cartService.removeProducts(userId, productIds);

        return savedOrder;
    }

    @Autowired
    private CartService cartService;

    @Autowired
    private ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Populate isReviewed
        Long userId = order.getUser().getId();
        List<Review> reviews = reviewRepository.findByUserId(userId);
        java.util.Set<String> reviewedKeys = new java.util.HashSet<>();
        for (Review r : reviews) {
            String key = r.getOrder().getId() + "_" + r.getProduct().getId();
            reviewedKeys.add(key);
        }

        for (OrderItem item : order.getOrderItems()) {
            String itemKey = order.getId() + "_" + item.getProduct().getId();
            if (reviewedKeys.contains(itemKey)) {
                item.setReviewed(true);
            }
        }

        return order;
    }

    @Transactional(readOnly = true)
    public List<Order> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);

        // Populate isReviewed
        List<Review> reviews = reviewRepository.findByUserId(userId);
        java.util.Set<String> reviewedKeys = new java.util.HashSet<>();
        for (Review r : reviews) {
            String key = r.getOrder().getId() + "_" + r.getProduct().getId();
            reviewedKeys.add(key);
        }

        for (Order order : orders) {
            for (OrderItem item : order.getOrderItems()) {
                String itemKey = order.getId() + "_" + item.getProduct().getId();
                if (reviewedKeys.contains(itemKey)) {
                    item.setReviewed(true);
                }
            }
        }
        return orders;
    }

    public Order updateStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
