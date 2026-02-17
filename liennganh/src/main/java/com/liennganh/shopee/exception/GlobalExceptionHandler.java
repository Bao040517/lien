package com.liennganh.shopee.exception;

import com.liennganh.shopee.dto.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Class xử lý lỗi toàn cục cho ứng dụng (Global Exception Handler)
 * Bắt mọi exception ném ra từ Controller và trả về format chuẩn ApiResponse
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Xử lý lỗi do ứng dụng tự ném ra (AppException)
     */
    @ExceptionHandler(value = AppException.class)
    public ResponseEntity<ApiResponse<Object>> handlingAppException(AppException exception) {
        log.error("AppException caught: {}", exception.getErrorCode().getMessage(), exception);
        ErrorCode errorCode = exception.getErrorCode();
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(false);
        apiResponse.setCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode()).body(apiResponse);
    }

    /**
     * Xử lý lỗi Runtime không xác định
     */
    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<ApiResponse<Object>> handlingRuntimeException(RuntimeException exception) {
        log.error("RuntimeException caught: ", exception);
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(false);
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage() + ": " + exception.toString());
        // Có thể ẩn stacktrace ở production để bảo mật
        apiResponse.setData(java.util.Arrays.toString(exception.getStackTrace()));
        return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getStatusCode()).body(apiResponse);
    }

    /**
     * Xử lý lỗi validate dữ liệu đầu vào (@Valid)
     */
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handlingValidationException(MethodArgumentNotValidException exception) {
        log.error("Validation exception: ", exception);
        // Lấy message lỗi đầu tiên từ validation result
        String errorMessage = exception.getBindingResult().getFieldError() != null
                ? exception.getBindingResult().getFieldError().getDefaultMessage()
                : ErrorCode.INVALID_INPUT.getMessage();

        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(false);
        apiResponse.setCode(ErrorCode.INVALID_INPUT.getCode());
        apiResponse.setMessage(errorMessage);
        return ResponseEntity.status(ErrorCode.INVALID_INPUT.getStatusCode()).body(apiResponse);
    }

    // Xử lý client ngắt kết nối (browser cancel request) - không cần log dài dòng
    @ExceptionHandler(value = org.apache.catalina.connector.ClientAbortException.class)
    public void handlingClientAbortException(org.apache.catalina.connector.ClientAbortException exception) {
        log.warn("Client disconnected: {}", exception.getMessage());
    }

    /**
     * Xử lý tất cả các Exception còn lại
     */
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse<Object>> handlingException(Exception exception) {
        log.error("Unhandled exception: ", exception);
        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setSuccess(false);
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage() + ": " + exception.getMessage());
        apiResponse.setData(exception.toString());
        return ResponseEntity.status(ErrorCode.UNCATEGORIZED_EXCEPTION.getStatusCode()).body(apiResponse);
    }
}
