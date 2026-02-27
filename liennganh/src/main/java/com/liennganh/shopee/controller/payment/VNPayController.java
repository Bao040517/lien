package com.liennganh.shopee.controller.payment;

import com.liennganh.shopee.config.VNPayConfig;
import com.liennganh.shopee.entity.Order;
import com.liennganh.shopee.service.order.OrderService;
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

    @Autowired
    private OrderService orderService;

    @GetMapping("/create")
    public Map<String, String> createPayment(@RequestParam long orderId, @RequestParam long amount,
            @RequestParam(defaultValue = "Thanh toan don hang") String orderInfo, HttpServletRequest request) {
        Map<String, String> vnp_Params = new HashMap<>();

        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnPayConfig.tmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", String.valueOf(orderId));
        vnp_Params.put("vnp_OrderInfo", orderInfo + " " + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.returnUrl);
        vnp_Params.put("vnp_IpAddr", request.getRemoteAddr());

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // === Build hash data + query string (ĐÚNG theo VNPay demo) ===
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(vnPayConfig.hashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnPayConfig.payUrl + "?" + queryUrl;

        Map<String, String> result = new HashMap<>();
        result.put("paymentUrl", paymentUrl);
        return result;
    }

    // === IPN URL ===
    @GetMapping("/vnpay-ipn")
    public Map<String, String> vnpayIPN(@RequestParam Map<String, String> params) {
        Map<String, String> response = new HashMap<>();

        try {
            String vnpSecureHash = params.get("vnp_SecureHash");
            params.remove("vnp_SecureHash");
            params.remove("vnp_SecureHashType");

            String signValue = vnPayConfig.hashAllFields(params);

            if (signValue.equals(vnpSecureHash)) {
                String responseCode = params.get("vnp_ResponseCode");
                String txnRef = params.get("vnp_TxnRef");

                if ("00".equals(responseCode)) {
                    try {
                        Long oid = Long.parseLong(txnRef);
                        orderService.updateStatus(oid, Order.OrderStatus.PENDING);
                        System.out.println("[VNPay IPN] Order " + oid + " paid successfully");
                    } catch (Exception e) {
                        System.out.println("[VNPay IPN] Error updating order: " + e.getMessage());
                    }
                    response.put("RspCode", "00");
                    response.put("Message", "Confirm Success");
                } else {
                    response.put("RspCode", "00");
                    response.put("Message", "Confirm Success");
                }
            } else {
                response.put("RspCode", "97");
                response.put("Message", "Invalid Checksum");
            }
        } catch (Exception e) {
            response.put("RspCode", "99");
            response.put("Message", "Unknown error");
        }

        return response;
    }

    // === Return URL ===
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
            response.put("message", "00".equals(responseCode) ? "Thanh toan thanh cong" : "Thanh toan that bai");
            response.put("orderId", params.get("vnp_TxnRef"));
            response.put("amount", params.get("vnp_Amount"));
            response.put("transactionNo", params.get("vnp_TransactionNo"));
        } else {
            response.put("code", "97");
            response.put("message", "Chu ky khop hop le");
        }
        return response;
    }
}
