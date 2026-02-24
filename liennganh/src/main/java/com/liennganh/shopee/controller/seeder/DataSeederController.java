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
 * Controller há»— trá»£ táº¡o dá»¯ liá»‡u máº«u (Seeding)
 * DÃ¹ng Ä‘á»ƒ khá»Ÿi táº¡o dá»¯ liá»‡u giáº£ cho má»¥c Ä‘Ã­ch kiá»ƒm thá»­ vÃ  phÃ¡t triá»ƒn
 * Quyá»n háº¡n: Public (Ä‘á»ƒ dá»… dÃ ng reset DB)
 */
@RestController
@RequestMapping("/seed-db")
public class DataSeederController {

    @Autowired
    private DataSeederService dataSeederService;

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho NgÆ°á»i dÃ¹ng
     */
    @PostMapping("/users")
    public ApiResponse<String> seedUsers(@RequestParam(defaultValue = "10") int count) {
        dataSeederService.seedUsers(count);
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u users thÃ nh cÃ´ng", "Success");
    }

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho Shop
     */
    @PostMapping("/shops")
    public ApiResponse<String> seedShops(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedShops(count);
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u shops thÃ nh cÃ´ng", "Success");
    }

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho Danh má»¥c
     */
    @PostMapping("/categories")
    public ApiResponse<String> seedCategories(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedCategories(count);
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u categories thÃ nh cÃ´ng", "Success");
    }

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho Sáº£n pháº©m
     */
    @PostMapping("/products")
    public ApiResponse<String> seedProducts(@RequestParam(defaultValue = "20") int count) {
        dataSeederService.seedProducts(count);
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u products thÃ nh cÃ´ng", "Success");
    }

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho Voucher
     */
    @PostMapping("/vouchers")
    public ApiResponse<String> seedVouchers(@RequestParam(defaultValue = "5") int count) {
        dataSeederService.seedVouchers(count);
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u vouchers thÃ nh cÃ´ng", "Success");
    }

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho Biáº¿n thá»ƒ sáº£n pháº©m
     */
    @PostMapping("/product-variants")
    public ApiResponse<String> seedProductVariants() {
        dataSeederService.seedProductVariants();
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u biáº¿n thá»ƒ sáº£n pháº©m thÃ nh cÃ´ng", "Success");
    }

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho ÄÆ¡n hÃ ng
     */
    @PostMapping("/orders")
    public ApiResponse<String> seedOrders(@RequestParam(defaultValue = "10") int count) {
        dataSeederService.seedOrders(count);
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u orders thÃ nh cÃ´ng", "Success");
    }

    /**
     * Táº¡o dá»¯ liá»‡u giáº£ cho ÄÃ¡nh giÃ¡
     */
    @PostMapping("/reviews")
    public ApiResponse<String> seedReviews(@RequestParam(defaultValue = "5") int maxPerProduct) {
        dataSeederService.seedReviews(maxPerProduct);
        return ApiResponse.success("Táº¡o dá»¯ liá»‡u reviews thÃ nh cÃ´ng", "Success");
    }

    /**
     * XÃ³a toÃ n bá»™ dá»¯ liá»‡u trong database
     */
    @Transactional
    @PostMapping("/clear")
    public ApiResponse<String> clearAll() {
        dataSeederService.clearAllData();
        return ApiResponse.success("ÄÃ£ xÃ³a toÃ n bá»™ dá»¯ liá»‡u", "Success");
    }

    /**
     * Cháº¡y toÃ n bá»™ quy trÃ¬nh seeding
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
        return ApiResponse.success("ÄÃ£ hoÃ n táº¥t táº¡o toÃ n bá»™ dá»¯ liá»‡u máº«u", "Success");
    }

    /**
     * Reset database: XÃ³a háº¿t vÃ  táº¡o má»›i láº¡i tá»« Ä‘áº§u
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
        return ApiResponse.success("ÄÃ£ reset vÃ  táº¡o má»›i dá»¯ liá»‡u thÃ nh cÃ´ng", "Success");
    }
}

