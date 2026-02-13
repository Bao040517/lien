package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.SellerStatisticsDTO;
import com.liennganh.shopee.model.Product;
import com.liennganh.shopee.model.Shop;
import com.liennganh.shopee.service.SellerService;
import com.liennganh.shopee.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;
    private final StatisticsService statisticsService;

    // Shop Management
    @GetMapping("/shop")
    public ApiResponse<Shop> getMyShop(@RequestParam Long sellerId) {
        // TODO: Get sellerId from session/token
        Shop shop = sellerService.getMyShop(sellerId);
        return ApiResponse.success(shop, "Lấy thông tin shop thành công");
    }

    @PostMapping("/shop")
    public ApiResponse<Shop> createShop(@RequestParam Long sellerId, @RequestBody Shop shop) {
        // TODO: Get sellerId from session/token
        Shop createdShop = sellerService.createShop(sellerId, shop);
        return ApiResponse.success(createdShop, "Tạo shop thành công");
    }

    @PutMapping("/shop")
    public ApiResponse<Shop> updateShop(@RequestParam Long sellerId, @RequestBody Shop shop) {
        // TODO: Get sellerId from session/token
        Shop updatedShop = sellerService.updateShop(sellerId, shop);
        return ApiResponse.success(updatedShop, "Cập nhật shop thành công");
    }

    // Product Management
    @GetMapping("/products")
    public ApiResponse<List<Product>> getMyProducts(@RequestParam Long sellerId) {
        // TODO: Get sellerId from session/token
        List<Product> products = sellerService.getMyProducts(sellerId);
        return ApiResponse.success(products, "Lấy danh sách sản phẩm thành công");
    }

    @PostMapping("/products")
    public ApiResponse<Product> createProduct(@RequestParam Long sellerId, @RequestBody Product product) {
        // TODO: Get sellerId from session/token
        Product createdProduct = sellerService.createProduct(sellerId, product);
        return ApiResponse.success(createdProduct, "Tạo sản phẩm thành công");
    }

    @PutMapping("/products/{id}")
    public ApiResponse<Product> updateProduct(
            @RequestParam Long sellerId,
            @PathVariable Long id,
            @RequestBody Product product) {
        // TODO: Get sellerId from session/token
        Product updatedProduct = sellerService.updateProduct(sellerId, id, product);
        return ApiResponse.success(updatedProduct, "Cập nhật sản phẩm thành công");
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@RequestParam Long sellerId, @PathVariable Long id) {
        // TODO: Get sellerId from session/token
        sellerService.deleteProduct(sellerId, id);
        return ApiResponse.success(null, "Xóa sản phẩm thành công");
    }

    // Statistics
    @GetMapping("/statistics")
    public ApiResponse<SellerStatisticsDTO> getStatistics(@RequestParam Long sellerId) {
        // TODO: Get sellerId from session/token
        SellerStatisticsDTO stats = statisticsService.getSellerStatistics(sellerId);
        return ApiResponse.success(stats, "Lấy thống kê thành công");
    }
}
