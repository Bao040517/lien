package com.liennganh.shopee.dto.request;

import lombok.Data;
import java.util.List;

/**
 * DTO cho yêu cầu tạo đơn hàng
 */
@Data
public class OrderRequest {
    private Long userId; // ID người mua (thường lấy từ token, nhưng có thể truyền lên nếu cần)
    private List<OrderItemRequest> items; // Danh sách sản phẩm muốn mua
    private String voucherCode; // M� gi?m gi� (n?u c�)
    private Long addressId; // ID địa chỉ giao hàng
    private String paymentMethod; // Phương thức thanh toán (COD, BANKING)

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public static class OrderItemRequest {
        private Long productId; // ID sản phẩm
        private Integer quantity; // Số lượng

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
