package com.liennganh.shopee.dto.response;

/**
 * Định dạng phản hồi chuẩn cho API (Standard API Response)
 * 
 */
public class ApiResponse<T> {
    private boolean success; // Trạng thái thành công hay thất bại
    private int code = 1000; // M� l?i (1000 = success)
    private String message; // Thông báo đi kèm
    private T data; // Dữ liệu chính

    // Helper method để tạo response thành công nhanh
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, 1000, message, data);
    }

    // Helper method để tạo response lỗi nhanh
    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }

    public ApiResponse() {
    }

    public ApiResponse(boolean success, int code, String message, T data) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
