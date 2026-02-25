package com.liennganh.shopee.controller.seller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.dto.response.SellerStatisticsDTO;
import com.liennganh.shopee.entity.Product;
import com.liennganh.shopee.entity.Shop;
import com.liennganh.shopee.service.shop.SellerService;
import com.liennganh.shopee.service.shop.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.liennganh.shopee.service.order.OrderService;
import com.liennganh.shopee.entity.Order;

import java.util.List;

/**
 * Controller dành cho Người bán (Seller)
 * Cung cấp các API quản lý Shop, Sản phẩm và xem Thống kê
 * Quyền hạn: SELLER hoặc ADMIN
 */
@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('SELLER', 'ADMIN')")
public class SellerController {

    private final SellerService sellerService;
    private final StatisticsService statisticsService;
    private final OrderService orderService;

    // ========== QUẢN LÝ ĐƠN HÀNG (ORDER MANAGEMENT) ==========

    /**
     * Lấy danh sách đơn hàng của shop
     * Quyền hạn: SELLER, ADMIN
     */
    @GetMapping("/orders")
    public ApiResponse<List<Order>> getShopOrders(@RequestParam Long sellerId) {
        Shop shop = sellerService.getMyShop(sellerId);
        List<Order> orders = orderService.getOrdersByShop(shop.getId());
        return ApiResponse.success(orders, "Lấy danh sách đơn hàng thành công");
    }

    // ========== QUẢN LÝ SHOP (SHOP MANAGEMENT) ==========

    /**
     * Lấy thông tin shop của seller
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @GetMapping("/shop")
    public ApiResponse<Shop> getMyShop(@RequestParam Long sellerId) {
        Shop shop = sellerService.getMyShop(sellerId);
        return ApiResponse.success(shop, "Lấy thông tin shop thành công");
    }

    /**
     * Tạo shop mới
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PostMapping("/shop")
    public ApiResponse<Shop> createShop(@RequestParam Long sellerId, @RequestBody Shop shop) {
        Shop createdShop = sellerService.createShop(sellerId, shop);
        return ApiResponse.success(createdShop, "Tạo shop thành công");
    }

    /**
     * Cập nhật thông tin shop
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PutMapping("/shop")
    public ApiResponse<Shop> updateShop(@RequestParam Long sellerId, @RequestBody Shop shop) {
        Shop updatedShop = sellerService.updateShop(sellerId, shop);
        return ApiResponse.success(updatedShop, "Cập nhật shop thành công");
    }

    // ========== QUẢN LÝ SẢN PHẨM (PRODUCT MANAGEMENT) ==========

    /**
     * Lấy danh sách sản phẩm của shop
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @GetMapping("/products")
    public ApiResponse<org.springframework.data.domain.Page<Product>> getMyProducts(
            @RequestParam Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        org.springframework.data.domain.Page<Product> products = sellerService.getMyProducts(sellerId, page, size);
        return ApiResponse.success(products, "Lấy danh sách sản phẩm thành công");
    }

    /**
     * Tạo sản phẩm mới cho shop
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PostMapping("/products")
    public ApiResponse<Product> createProduct(@RequestParam Long sellerId, @RequestBody Product product) {
        Product createdProduct = sellerService.createProduct(sellerId, product);
        return ApiResponse.success(createdProduct, "Tạo sản phẩm thành công");
    }

    /**
     * Cập nhật sản phẩm
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @PutMapping("/products/{id}")
    public ApiResponse<Product> updateProduct(
            @RequestParam Long sellerId,
            @PathVariable Long id,
            @RequestBody Product product) {
        Product updatedProduct = sellerService.updateProduct(sellerId, id, product);
        return ApiResponse.success(updatedProduct, "Cập nhật sản phẩm thành công");
    }

    /**
     * Xóa sản phẩm
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@RequestParam Long sellerId, @PathVariable Long id) {
        sellerService.deleteProduct(sellerId, id);
        return ApiResponse.success(null, "Xóa sản phẩm thành công");
    }

    // ========== THỐNG KÊ (STATISTICS) ==========

    /**
     * Xem thống kê chi tiết của shop
     * Bao gồm doanh thu, đơn hàng, sản phẩm bán chạy...
     * Quyền hạn: SELLER, ADMIN
     * 
     */
    @GetMapping("/statistics")
    public ApiResponse<SellerStatisticsDTO> getStatistics(@RequestParam Long sellerId) {
        SellerStatisticsDTO stats = statisticsService.getSellerStatistics(sellerId);
        return ApiResponse.success(stats, "Lấy thống kê thành công");
    }
}
