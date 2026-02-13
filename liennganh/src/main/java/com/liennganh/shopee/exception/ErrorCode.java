package com.liennganh.shopee.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // Authentication & Authorization (1xxx)
    UNAUTHENTICATED(1001, "Chưa đăng nhập", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1002, "Không có quyền truy cập", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(1003, "Sai tên đăng nhập hoặc mật khẩu", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(1004, "Phiên đăng nhập đã hết hạn", HttpStatus.UNAUTHORIZED),

    // User errors (2xxx)
    USER_NOT_FOUND(2001, "Không tìm thấy người dùng", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS(2002, "Tên đăng nhập hoặc email đã tồn tại", HttpStatus.BAD_REQUEST),
    USER_LOCKED(2003, "Tài khoản đã bị khóa", HttpStatus.FORBIDDEN),
    INVALID_USER_DATA(2004, "Thông tin người dùng không hợp lệ", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTS(2005, "Email đã được sử dụng", HttpStatus.BAD_REQUEST),
    USERNAME_ALREADY_EXISTS(2006, "Tên đăng nhập đã tồn tại", HttpStatus.BAD_REQUEST),

    // Seller errors (3xxx)
    SELLER_NOT_APPROVED(3001, "Người bán chưa được duyệt", HttpStatus.FORBIDDEN),
    SELLER_REJECTED(3002, "Đơn đăng ký bán hàng đã bị từ chối", HttpStatus.FORBIDDEN),
    SELLER_SUSPENDED(3003, "Tài khoản người bán đã bị tạm khóa", HttpStatus.FORBIDDEN),
    SHOP_NOT_FOUND(3004, "Không tìm thấy shop", HttpStatus.NOT_FOUND),
    NOT_SHOP_OWNER(3005, "Bạn không phải chủ shop này", HttpStatus.FORBIDDEN),
    SHOP_ALREADY_EXISTS(3006, "Bạn đã có shop rồi", HttpStatus.BAD_REQUEST),
    SELLER_ALREADY_REGISTERED(3007, "Bạn đã đăng ký làm người bán", HttpStatus.BAD_REQUEST),

    // Product errors (4xxx)
    PRODUCT_NOT_FOUND(4001, "Không tìm thấy sản phẩm", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(4002, "Không đủ hàng trong kho", HttpStatus.BAD_REQUEST),
    INVALID_PRODUCT_DATA(4003, "Thông tin sản phẩm không hợp lệ", HttpStatus.BAD_REQUEST),
    PRODUCT_OUT_OF_STOCK(4004, "Sản phẩm đã hết hàng", HttpStatus.BAD_REQUEST),
    INVALID_PRICE(4005, "Giá sản phẩm không hợp lệ", HttpStatus.BAD_REQUEST),

    // Order errors (5xxx)
    ORDER_NOT_FOUND(5001, "Không tìm thấy đơn hàng", HttpStatus.NOT_FOUND),
    INVALID_ORDER_STATUS(5002, "Trạng thái đơn hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    CANNOT_CANCEL_ORDER(5003, "Không thể hủy đơn hàng này", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_CANCELLED(5004, "Đơn hàng đã bị hủy", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_COMPLETED(5005, "Đơn hàng đã hoàn thành", HttpStatus.BAD_REQUEST),
    NOT_ORDER_OWNER(5006, "Bạn không phải chủ đơn hàng này", HttpStatus.FORBIDDEN),
    INVALID_STATUS_TRANSITION(5007, "Không thể chuyển sang trạng thái này", HttpStatus.BAD_REQUEST),

    // Cart errors (6xxx)
    CART_EMPTY(6001, "Giỏ hàng trống", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(6002, "Không tìm thấy sản phẩm trong giỏ hàng", HttpStatus.NOT_FOUND),
    INVALID_QUANTITY(6003, "Số lượng không hợp lệ", HttpStatus.BAD_REQUEST),

    // Category errors (7xxx)
    CATEGORY_NOT_FOUND(7001, "Không tìm thấy danh mục", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(7002, "Danh mục đã tồn tại", HttpStatus.BAD_REQUEST),
    CATEGORY_HAS_PRODUCTS(7003, "Không thể xóa danh mục đang có sản phẩm", HttpStatus.BAD_REQUEST),

    // Voucher errors (8xxx)
    VOUCHER_NOT_FOUND(8001, "Không tìm thấy voucher", HttpStatus.NOT_FOUND),
    VOUCHER_EXPIRED(8002, "Voucher đã hết hạn", HttpStatus.BAD_REQUEST),
    VOUCHER_NOT_STARTED(8003, "Voucher chưa bắt đầu", HttpStatus.BAD_REQUEST),
    VOUCHER_OUT_OF_USAGE(8004, "Voucher đã hết lượt sử dụng", HttpStatus.BAD_REQUEST),
    ORDER_NOT_MEET_MIN_VALUE(8005, "Đơn hàng chưa đạt giá trị tối thiểu", HttpStatus.BAD_REQUEST),
    INVALID_VOUCHER_CODE(8006, "Mã voucher không hợp lệ", HttpStatus.BAD_REQUEST),

    // Review errors (9xxx)
    REVIEW_NOT_FOUND(9001, "Không tìm thấy đánh giá", HttpStatus.NOT_FOUND),
    ALREADY_REVIEWED(9002, "Bạn đã đánh giá sản phẩm này rồi", HttpStatus.BAD_REQUEST),
    CANNOT_REVIEW_PRODUCT(9003, "Bạn chưa mua sản phẩm này", HttpStatus.FORBIDDEN),
    ORDER_NOT_DELIVERED(9004, "Đơn hàng chưa được giao", HttpStatus.BAD_REQUEST),
    INVALID_RATING(9005, "Điểm đánh giá không hợp lệ (1-5)", HttpStatus.BAD_REQUEST),

    // Address errors (10xxx)
    ADDRESS_NOT_FOUND(10001, "Không tìm thấy địa chỉ", HttpStatus.NOT_FOUND),
    NOT_ADDRESS_OWNER(10002, "Bạn không phải chủ địa chỉ này", HttpStatus.FORBIDDEN),

    // System errors (99xxx)
    INVALID_INPUT(99001, "Dữ liệu đầu vào không hợp lệ", HttpStatus.BAD_REQUEST),
    DATABASE_ERROR(99002, "Lỗi cơ sở dữ liệu", HttpStatus.INTERNAL_SERVER_ERROR),
    UNCATEGORIZED_EXCEPTION(99999, "Lỗi không xác định", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus statusCode;

    ErrorCode(int code, String message, HttpStatus statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
