package com.liennganh.shopee.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;

/**
 * Enum d?nh nghia c�c m� l?i (ErrorCode) trong h? th?ng
 */
@Getter
public enum ErrorCode {
    // Nhóm lỗi Xác thực & Phân quyền (Authentication & Authorization) - 1xxx
    UNAUTHENTICATED(1001, "Chưa đăng nhập", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1002, "Không có quyền truy cập", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(1003, "Sai tên đăng nhập hoặc mật khẩu", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(1004, "Phi�n dang nh?p d� h?t h?n", HttpStatus.UNAUTHORIZED),

    // Nhóm lỗi Người dùng (User) - 2xxx
    USER_NOT_FOUND(2001, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS(2002, "T�n dang nh?p ho?c email d� t?n t?i", HttpStatus.BAD_REQUEST),
    USER_LOCKED(2003, "T�i kho?n d� b? kh�a", HttpStatus.FORBIDDEN),
    INVALID_USER_DATA(2004, "Thông tin người dùng không hợp lệ", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS(2005, "Email d� du?c s? d?ng", HttpStatus.BAD_REQUEST),
    USERNAME_ALREADY_EXISTS(2006, "T�n dang nh?p d� t?n t?i", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Người bán (Seller) - 3xxx
    SELLER_NOT_APPROVED(3001, "Người bán chưa được duyệt", HttpStatus.FORBIDDEN),
    SELLER_REJECTED(3002, "�on dang k� b�n h�ng d� b? t? ch?i", HttpStatus.FORBIDDEN),
    SELLER_SUSPENDED(3003, "T�i kho?n ngu?i b�n d� b? t?m kh�a", HttpStatus.FORBIDDEN),
    SHOP_NOT_FOUND(3004, "Không tìm thấy shop", HttpStatus.NOT_FOUND),
    NOT_SHOP_OWNER(3005, "Bạn không phải chủ shop này", HttpStatus.FORBIDDEN),
    SHOP_ALREADY_EXISTS(3006, "B?n d� c� shop r?i", HttpStatus.BAD_REQUEST),
    SELLER_ALREADY_REGISTERED(3007, "B?n d� dang k� l�m ngu?i b�n", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Sản phẩm (Product) - 4xxx
    PRODUCT_NOT_FOUND(4001, "Không tìm thấy sản phẩm", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(4002, "Không đủ hàng trong kho", HttpStatus.BAD_REQUEST),
    INVALID_PRODUCT_DATA(4003, "Thông tin sản phẩm không hợp lệ", HttpStatus.BAD_REQUEST),
    PRODUCT_OUT_OF_STOCK(4004, "S?n ph?m d� h?t h�ng", HttpStatus.BAD_REQUEST),
    INVALID_PRICE(4005, "Giá sản phẩm không hợp lệ", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Đơn hàng (Order) - 5xxx
    ORDER_NOT_FOUND(5001, "Không tìm thấy đơn hàng", HttpStatus.NOT_FOUND),
    INVALID_ORDER_STATUS(5002, "Trạng thái đơn hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    CANNOT_CANCEL_ORDER(5003, "Không thể hủy đơn hàng này", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_CANCELLED(5004, "�on h�ng d� b? h?y", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_COMPLETED(5005, "�on h�ng d� ho�n th�nh", HttpStatus.BAD_REQUEST),
    NOT_ORDER_OWNER(5006, "Bạn không phải chủ đơn hàng này", HttpStatus.FORBIDDEN),
    INVALID_STATUS_TRANSITION(5007, "Không thể chuyển sang trạng thái này", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Giỏ hàng (Cart) - 6xxx
    CART_EMPTY(6001, "Giỏ hàng trống", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(6002, "Không tìm thấy sản phẩm trong giỏ hàng", HttpStatus.NOT_FOUND),
    INVALID_QUANTITY(6003, "Số lượng không hợp lệ", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Danh mục (Category) - 7xxx
    CATEGORY_NOT_FOUND(7001, "Không tìm thấy danh mục", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(7002, "Danh m?c d� t?n t?i", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_PRODUCTS(7003, "Không thể xóa danh mục đang có sản phẩm", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Voucher (8xxx)
    VOUCHER_NOT_FOUND(8001, "Không tìm thấy voucher", HttpStatus.NOT_FOUND),
    VOUCHER_EXPIRED(8002, "Voucher d� h?t h?n", HttpStatus.BAD_REQUEST),
    VOUCHER_NOT_STARTED(8003, "Voucher chưa bắt đầu", HttpStatus.BAD_REQUEST),
    VOUCHER_OUT_OF_USAGE(8004, "Voucher d� h?t lu?t s? d?ng (c?a b?n ho?c to�n h? th?ng)", HttpStatus.BAD_REQUEST),
    ORDER_NOT_MEET_MIN_VALUE(8005, "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng voucher", HttpStatus.BAD_REQUEST),
    INVALID_VOUCHER_CODE(8006, "M� voucher kh�ng h?p l?", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Thông báo (Notification) - 13xxx
    NOTIFICATION_NOT_FOUND(13001, "Không tìm thấy thông báo", HttpStatus.NOT_FOUND),

    // Nhóm lỗi Đánh giá (Review) - 9xxx
    REVIEW_NOT_FOUND(9001, "Không tìm thấy đánh giá", HttpStatus.NOT_FOUND),
    ALREADY_REVIEWED(9002, "B?n d� d�nh gi� s?n ph?m n�y r?i", HttpStatus.BAD_REQUEST),
    CANNOT_REVIEW_PRODUCT(9003, "Bạn chưa mua sản phẩm này hoặc chưa nhận hàng", HttpStatus.FORBIDDEN),
    ORDER_NOT_DELIVERED(9004, "Đơn hàng chưa được giao thành công nên chưa thể đánh giá", HttpStatus.BAD_REQUEST),
    INVALID_RATING(9005, "Điểm đánh giá không hợp lệ (1-5)", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi Địa chỉ (Address) - 10xxx
    ADDRESS_NOT_FOUND(10001, "Không tìm thấy địa chỉ", HttpStatus.NOT_FOUND),
    NOT_ADDRESS_OWNER(10002, "Bạn không phải chủ địa chỉ này", HttpStatus.FORBIDDEN),

    // Nhóm lỗi Flash Sale (11xxx)
    FLASH_SALE_NOT_FOUND(11001, "Không tìm thấy chương trình Flash Sale", HttpStatus.NOT_FOUND),
    FLASH_SALE_CONFLICT(11002, "Khung gi? n�y d� c� Flash Sale kh�c", HttpStatus.BAD_REQUEST),
    FLASH_SALE_ENDED(11003, "Flash Sale d� k?t th�c", HttpStatus.BAD_REQUEST),

    // Nhóm lỗi File (12xxx)
    FILE_STORAGE_ERROR(12001, "Lỗi lưu trữ file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_NOT_FOUND(12002, "Không tìm thấy file", HttpStatus.NOT_FOUND),

    // Nhóm lỗi Hệ thống (System) - 99xxx
    INVALID_INPUT(99001, "Dữ liệu đầu vào không hợp lệ", HttpStatus.BAD_REQUEST),
    DATABASE_ERROR(99002, "Lỗi cơ sở dữ liệu", HttpStatus.INTERNAL_SERVER_ERROR),
    UNCATEGORIZED_EXCEPTION(99999, "Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code; // M� l?i n?i b?
    private final String message; // Thông báo lỗi
    private final HttpStatus statusCode; // M� HTTP Status tuong ?ng

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public HttpStatus getStatusCode() {
        return statusCode;
    }
}
