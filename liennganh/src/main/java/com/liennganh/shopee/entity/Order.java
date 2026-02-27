package com.liennganh.shopee.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity đại diện cho Đơn hàng (Order)
 */
@Entity
@Data
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người mua

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher; // Voucher áp dụng (nếu có)

    @ManyToOne
    @JoinColumn(name = "shipping_address_id")
    private Address shippingAddress; // Địa chỉ giao hàng

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod; // Phương thức thanh toán

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status; // Trạng thái đơn hàng

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice; // Tổng tiền hàng (trước giảm giá)

    @Column(name = "final_price", nullable = false)
    private BigDecimal finalPrice; // Tổng tiền thanh toán (sau giảm giá)

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @lombok.ToString.Exclude
    private List<OrderItem> orderItems; // Danh sách sản phẩm trong đơn

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum OrderStatus {
        PENDING, // Chờ xác nhận - người bán đang chuẩn bị hàng
        SHIPPING, // �ang v?n chuy?n - don v? v?n chuy?n d� l?y h�ng
        DELIVERING, // Đang giao hàng - shipper đang giao
        DELIVERED, // Giao hàng thành công
        CANCELLED // �� h?y
    }

    public enum PaymentMethod {
        COD, // Thanh toán khi nhận hàng
        BANKING, // Chuyển khoản ngân hàng
        VNPAY // Thanh toán qua VNPay
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Voucher getVoucher() {
        return voucher;
    }

    public void setVoucher(Voucher voucher) {
        this.voucher = voucher;
    }

    public Address getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(Address shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
