package com.liennganh.shopee.controller.seeder;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.service.common.DataSeederService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * Controller hỗ trợ tạo dữ liệu mẫu (Seeding)
 * Dùng để khởi tạo dữ liệu giả cho mục đích kiểm thử và phát triển
 * Quyền hạn: Public (để dễ dàng reset DB)
 */
@RestController
@RequestMapping("/seed-db")
public class DataSeederController {

    @Autowired
    private DataSeederService dataSeederService;

    /**
     * Tạo dữ liệu giả cho Người dùng
     */
    @PostMapping("/users")
    public ApiResponse<String> seedUsers(@RequestParam(defaultValue = "10") int count) {
        dataSeederService.seedUsers(count);
        return ApiResponse.success("Tạo dữ liệu users thành công", "Success");
    }

    /**
     * Tạo dữ liệu giả cho Shop
     */
    @PostMapping("/shops")
    public ApiResponse<String> seedShops(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedShops(count);
        return ApiResponse.success("Tạo dữ liệu shops thành công", "Success");
    }

    /**
     * Tạo dữ liệu giả cho Danh mục
     */
    @PostMapping("/categories")
    public ApiResponse<String> seedCategories(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedCategories(count);
        return ApiResponse.success("Tạo dữ liệu categories thành công", "Success");
    }

    /**
     * Tạo dữ liệu giả cho Sản phẩm
     */
    @PostMapping("/products")
    public ApiResponse<String> seedProducts(@RequestParam(defaultValue = "20") int count) {
        dataSeederService.seedProducts(count);
        return ApiResponse.success("Tạo dữ liệu products thành công", "Success");
    }

    /**
     * Tạo dữ liệu giả cho Voucher
     */
    @PostMapping("/vouchers")
    public ApiResponse<String> seedVouchers(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedVouchers(count);
        return ApiResponse.success("Tạo dữ liệu vouchers thành công", "Success");
    }

    /**
     * Tạo dữ liệu giả cho Biến thể sản phẩm
     */
    @PostMapping("/product-variants")
    public ApiResponse<String> seedProductVariants() {
        dataSeederService.seedProductVariants();
        return ApiResponse.success("Tạo dữ liệu biến thể sản phẩm thành công", "Success");
    }

    /**
     * Tạo dữ liệu giả cho Đơn hàng
     */
    @PostMapping("/orders")
    public ApiResponse<String> seedOrders(@RequestParam(defaultValue = "10") int count) {
        dataSeederService.seedOrders(count);
        return ApiResponse.success("Tạo dữ liệu orders thành công", "Success");
    }

    /**
     * Tạo dữ liệu giả cho Đánh giá
     */
    @PostMapping("/reviews")
    public ApiResponse<String> seedReviews(@RequestParam(defaultValue = "5") int maxPerProduct) {
        dataSeederService.seedReviews(maxPerProduct);
        return ApiResponse.success("Tạo dữ liệu reviews thành công", "Success");
    }

    /**
     * Xóa toàn bộ dữ liệu trong database
     */
    @Transactional
    @PostMapping("/clear")
    public ApiResponse<String> clearAll() {
        dataSeederService.clearAllData();
        return ApiResponse.success("Đã xóa toàn bộ dữ liệu", "Success");
    }

    /**
     * Chạy toàn bộ quy trình seeding
     */
    @Transactional
    @PostMapping("/all")
    public ApiResponse<String> seedAll() {
        dataSeederService.seedUsers(10);
        dataSeederService.seedShops(5);
        dataSeederService.seedCategories(18);
        dataSeederService.seedProducts(5);
        dataSeederService.seedVouchers(5);
        dataSeederService.seedProductVariants();
        dataSeederService.seedOrders(5);
        dataSeederService.seedReviews(3);
        return ApiResponse.success("Đã hoàn tất tạo toàn bộ dữ liệu mẫu", "Success");
    }

    /**
     * Reset database: Xóa hết và tạo mới lại từ đầu
     */
    @Transactional
    @PostMapping("/reset")
    public ApiResponse<String> resetAll() {
        dataSeederService.clearAllData();
        dataSeederService.seedUsers(10);
        dataSeederService.seedShops(5);
        dataSeederService.seedCategories(18);
        dataSeederService.seedProducts(5);
        dataSeederService.seedVouchers(5);
        dataSeederService.seedProductVariants();
        dataSeederService.seedOrders(5);
        dataSeederService.seedReviews(3);
        return ApiResponse.success("Đã reset và tạo mới dữ liệu thành công", "Success");
    }
}

