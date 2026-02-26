package com.liennganh.shopee.service.order;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.*;
import com.liennganh.shopee.repository.order.OrderRepository;
import com.liennganh.shopee.repository.product.ProductRepository;
import com.liennganh.shopee.repository.user.AddressRepository;
import com.liennganh.shopee.repository.user.UserRepository;
import com.liennganh.shopee.repository.product.ReviewRepository;
import com.liennganh.shopee.service.shop.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Service quản lý đơn hàng
 * Xử lý tạo đơn, cập nhật trạng thái, tính toán giá trị đơn hàng
 */
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private VoucherService voucherService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * Lấy danh sách tất cả đơn hàng (Admin/Internal use)
     * 
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Tạo đơn hàng mới
     * 
     * @throws AppException USER_NOT_FOUND, ADDRESS_NOT_FOUND, PRODUCT_NOT_FOUND,
     *                      PRODUCT_OUT_OF_STOCK
     */
    @Transactional
    public Order createOrder(Long userId, List<OrderItem> items, String voucherCode, Long addressId,
            String paymentMethod) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.PENDING); // Mặc định trạng thái chờ xử lý
        order.setOrderItems(items);

        // Xử lý phương thức thanh toán
        try {
            order.setPaymentMethod(
                    paymentMethod != null ? Order.PaymentMethod.valueOf(paymentMethod) : Order.PaymentMethod.COD);
        } catch (IllegalArgumentException e) {
            order.setPaymentMethod(Order.PaymentMethod.COD);
        }

        // Kiểm tra địa chỉ giao hàng
        if (addressId != null) {
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
            // Kiểm tra địa chỉ có thuộc về user không
            if (!address.getUser().getId().equals(userId)) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            order.setShippingAddress(address);
        }

        BigDecimal totalPrice = BigDecimal.ZERO;

        // Xử lý từng sản phẩm trong đơn hàng
        for (OrderItem item : items) {
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new AppException(ErrorCode.INVALID_QUANTITY);
            }
            Product product = productRepository.findById(item.getProduct().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

            if (!"APPROVED".equals(product.getProductStatus())) {
                throw new AppException(ErrorCode.PRODUCT_NOT_AVAILABLE);
            }

            // Kiểm tra tồn kho
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new AppException(ErrorCode.PRODUCT_OUT_OF_STOCK);
            }

            // Trừ tồn kho
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            product.setSold(product.getSold() + item.getQuantity());
            productRepository.save(product);

            // Set giá và thông tin cho order item
            item.setPrice(product.getPrice());
            item.setOrder(order);
            item.setProduct(product);

            BigDecimal itemTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalPrice = totalPrice.add(itemTotal);
        }

        order.setTotalPrice(totalPrice);
        order.setFinalPrice(totalPrice); // Giá sau cùng (nếu chưa áp voucher)

        // Áp dụng Voucher (nếu có)
        if (voucherCode != null && !voucherCode.isEmpty()) {
            Voucher voucher = voucherService.getVoucherByCode(voucherCode)
                    .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

            if (voucherService.isValid(voucher)) {
                // Kiểm tra giá trị đơn hàng tối thiểu
                if (voucher.getMinOrderValue() == null || totalPrice.compareTo(voucher.getMinOrderValue()) >= 0) {
                    BigDecimal discount = BigDecimal.ZERO;
                    if (voucher.getDiscountType() == Voucher.DiscountType.FIXED) {
                        discount = voucher.getDiscountValue();
                    } else {
                        // Giảm theo %
                        discount = totalPrice.multiply(voucher.getDiscountValue().divide(BigDecimal.valueOf(100)));
                    }

                    BigDecimal finalPrice = totalPrice.subtract(discount);
                    order.setFinalPrice(finalPrice.max(BigDecimal.ZERO)); // Không để giá âm
                    order.setVoucher(voucher);
                    voucherService.decreaseUsage(voucher); // Giảm lượt sử dụng voucher
                } else {
                    throw new AppException(ErrorCode.INVALID_VOUCHER_CODE);
                }
            } else {
                throw new AppException(ErrorCode.INVALID_VOUCHER_CODE);
            }
        }

        Order savedOrder = orderRepository.save(order);

        // Sau khi đặt hàng thành công, xóa các sản phẩm đó khỏi giỏ hàng
        List<Long> productIds = items.stream().map(item -> item.getProduct().getId()).toList();
        cartService.removeProducts(userId, productIds);

        return savedOrder;
    }

    /**
     * Lấy chi tiết đơn hàng theo ID
     * �?ng th?i ki?m tra xem user d� d�nh gi� s?n ph?m trong don h�ng chua
     * 
     * @throws AppException ORDER_NOT_FOUND
     */
    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // Kiểm tra trạng thái review của từng sản phẩm
        Long userId = order.getUser().getId();
        List<Review> reviews = reviewRepository.findByUserId(userId);

        // T?o set c�c key (orderId_productId) d� du?c review d? tra c?u nhanh (O(1))
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

    /**
     * Lấy danh sách đơn hàng của user
     * 
     */
    @Transactional(readOnly = true)
    public List<Order> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);

        // Logic tương tự để populate trạng thái isReviewed
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

    /**
     * Lấy danh sách đơn hàng của một Shop cụ thể
     */
    @Transactional(readOnly = true)
    public List<Order> getOrdersByShop(Long shopId) {
        List<Order> orders = orderRepository.findByShopId(shopId);

        // Populate isReviewed if necessary, but we might just return the list directly
        // for seller view
        return orders;
    }

    /**
     * Cập nhật trạng thái đơn hàng
     * 
     */
    public Order updateStatus(Long orderId, Order.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
