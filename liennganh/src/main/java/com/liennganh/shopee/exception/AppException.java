package com.liennganh.shopee.exception;

import lombok.Getter;

/**
 * Custom Exception cho ứng dụng
 * Dùng để ném ra các lỗi logic nghiệp vụ cụ thể (UserNotFound, InvalidInput...)
 */
@Getter
public class AppException extends RuntimeException {
    private ErrorCode errorCode;

    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
