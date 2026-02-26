package com.liennganh.shopee.controller.payment;

import com.liennganh.shopee.config.VNPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class VNPayController {
    @Autowired
    private VNPayConfig vnPayConfig;

    @GetMapping("/create")
    public Map<String, String> createPayment(@RequestParam long orderId, @RequestParam long amount,
            @RequestParam(defaultValue = "Thanh toan don hang") String orderInfo, HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();

        // === NHÓM 1: Cố định ===
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnPayConfig.tmnCode);
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_Locale", "vn");
        params.put("vnp_OrderType", "other");
        params.put("vnp_ReturnUrl", vnPayConfig.returnUrl);

        // === NHÓM 2: Từ đơn hàng ===
        params.put("vnp_TxnRef", String.valueOf(orderId));
        params.put("vnp_OrderInfo", orderInfo + " " + orderId);
        params.put("vnp_Amount", String.valueOf(amount * 100));

        // === NHÓM 3: Tự tạo ===
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
        params.put("vnp_CreateDate", df.format(cal.getTime()));

        cal.add(Calendar.MINUTE, 15); // Hết hạn sau 15 phút
        params.put("vnp_ExpireDate", df.format(cal.getTime()));

        params.put("vnp_IpAddr", request.getRemoteAddr());

        // === BƯỚC QUAN TRỌNG: Tạo chữ ký ===
        // 1. Sort tên params theo A→Z
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        // 2. Ghép thành query string (để ký + để làm URL)
        StringBuilder hashData = new StringBuilder(); // Chuỗi để ký
        StringBuilder query = new StringBuilder(); // Chuỗi URL

        for (String fieldName : fieldNames) {
            String value = params.get(fieldName);
            if (value != null && !value.isEmpty()) {
                // hashData: dùng để tạo chữ ký
                hashData.append(fieldName).append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

                // query: dùng để ghép URL
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                        .append('=')
                        .append(URLEncoder.encode(value, StandardCharsets.UTF_8));

                query.append('&');
                hashData.append('&');
            }
        }

        // Xóa dấu & cuối cùng
        if (hashData.length() > 0)
            hashData.setLength(hashData.length() - 1);
        if (query.length() > 0)
            query.setLength(query.length() - 1);

        // 3. Ký HMAC
        String secureHash = vnPayConfig.hmacSHA512(hashData.toString());

        // 4. Ghép URL cuối cùng
        String paymentUrl = vnPayConfig.payUrl + "?" + query + "&vnp_SecureHash=" + secureHash;

        // 5. Trả về cho frontend
        Map<String, String> result = new HashMap<>();
        result.put("paymentUrl", paymentUrl);
        return result;
    }

    // === IPN URL: VNPay gọi server→server để thông báo kết quả ===
    // Tại sao cần? Vì ReturnUrl chỉ redirect trình duyệt (có thể user tắt tab)
    // IPN đảm bảo server bạn LUÔN nhận được kết quả
    @GetMapping("/vnpay-ipn")
    public Map<String, String> vnpayIPN(@RequestParam Map<String, String> params) {
        Map<String, String> response = new HashMap<>();

        try {
            // Lấy SecureHash VNPay gửi về
            String vnpSecureHash = params.get("vnp_SecureHash");

            // Xóa hash ra khỏi params trước khi verify (vì khi ký không có hash)
            params.remove("vnp_SecureHash");
            params.remove("vnp_SecureHashType");

            // Tự tính lại hash từ các params còn lại
            String signValue = vnPayConfig.hashAllFields(params);

            if (signValue.equals(vnpSecureHash)) {
                // ✅ Checksum hợp lệ → dữ liệu không bị sửa
                String responseCode = params.get("vnp_ResponseCode");

                if ("00".equals(responseCode)) {
                    // Giao dịch thành công → Cập nhật DB
                    // TODO: orderService.updatePaymentStatus(orderId, "PAID")
                    response.put("RspCode", "00");
                    response.put("Message", "Confirm Success");
                } else {
                    // Giao dịch thất bại
                    response.put("RspCode", "00");
                    response.put("Message", "Confirm Success");
                }
            } else {
                // ❌ Checksum không khớp → Có thể bị hack
                response.put("RspCode", "97");
                response.put("Message", "Invalid Checksum");
            }
        } catch (Exception e) {
            response.put("RspCode", "99");
            response.put("Message", "Unknown error");
        }

        return response;
    }

    // === Return URL: Redirect trình duyệt về sau khi thanh toán ===
    // CHÚ Ý: KHÔNG cập nhật DB ở đây (IPN đã làm rồi)
    // Chỉ verify checksum + trả kết quả cho frontend hiển thị
    @GetMapping("/vnpay-return")
    public Map<String, String> vnpayReturn(@RequestParam Map<String, String> params) {
        String vnpSecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        String signValue = vnPayConfig.hashAllFields(params);
        Map<String, String> response = new HashMap<>();

        if (signValue.equals(vnpSecureHash)) {
            String responseCode = params.get("vnp_ResponseCode");
            response.put("code", responseCode);
            response.put("message", "00".equals(responseCode)
                    ? "Thanh toan thanh cong"
                    : "Thanh toan that bai");
        } else {
            response.put("code", "97");
            response.put("message", "Chu ky khong hop le");
        }
        return response;
    }

}
