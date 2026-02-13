package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.service.DataSeederService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seed-db")
public class DataSeederController {

    @Autowired
    private DataSeederService dataSeederService;

    @PostMapping("/users")
    public ApiResponse<String> seedUsers(@RequestParam(defaultValue = "10") int count) {
        dataSeederService.seedUsers(count);
        return ApiResponse.success("Seeding users completed", "Success");
    }

    @PostMapping("/shops")
    public ApiResponse<String> seedShops(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedShops(count);
        return ApiResponse.success("Seeding shops completed", "Success");
    }

    @PostMapping("/categories")
    public ApiResponse<String> seedCategories(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedCategories(count);
        return ApiResponse.success("Seeding categories completed", "Success");
    }

    @PostMapping("/products")
    public ApiResponse<String> seedProducts(@RequestParam(defaultValue = "20") int count) {
        dataSeederService.seedProducts(count);
        return ApiResponse.success("Seeding products completed", "Success");
    }

    @PostMapping("/vouchers")
    public ApiResponse<String> seedVouchers(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedVouchers(count);
        return ApiResponse.success("Seeding vouchers completed", "Success");
    }

    @PostMapping("/product-variants")
    public ApiResponse<String> seedProductVariants() {
        dataSeederService.seedProductVariants();
        return ApiResponse.success("Seeding product variants completed", "Success");
    }

    @PostMapping("/orders")
    public ApiResponse<String> seedOrders(@RequestParam(defaultValue = "10") int count) {
        dataSeederService.seedOrders(count);
        return ApiResponse.success("Seeding orders completed", "Success");
    }

    @PostMapping("/reviews")
    public ApiResponse<String> seedReviews(@RequestParam(defaultValue = "5") int maxPerProduct) {
        dataSeederService.seedReviews(maxPerProduct);
        return ApiResponse.success("Seeding reviews completed", "Success");
    }

    @Transactional
    @PostMapping("/clear")
    public ApiResponse<String> clearAll() {
        dataSeederService.clearAllData();
        return ApiResponse.success("All data cleared", "Success");
    }

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
        return ApiResponse.success("Seeding ALL data completed", "Success");
    }

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
        return ApiResponse.success("Database reset & seeded successfully", "Success");
    }
}
