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
 * Controller dÃ nh cho NgÆ°á»i bÃ¡n (Seller)
 * Cung cáº¥p cÃ¡c API quáº£n lÃ½ Shop, Sáº£n pháº©m vÃ  xem Thá»‘ng kÃª
 * Quyá»n háº¡n: SELLER hoáº·c ADMIN
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

    // ========== QUáº¢N LÃ SHOP (SHOP MANAGEMENT) ==========

    /**
     * Láº¥y thÃ´ng tin shop cá»§a seller
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @GetMapping("/shop")
    public ApiResponse<Shop> getMyShop(@RequestParam Long sellerId) {
        Shop shop = sellerService.getMyShop(sellerId);
        return ApiResponse.success(shop, "Láº¥y thÃ´ng tin shop thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o shop má»›i
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @PostMapping("/shop")
    public ApiResponse<Shop> createShop(@RequestParam Long sellerId, @RequestBody Shop shop) {
        Shop createdShop = sellerService.createShop(sellerId, shop);
        return ApiResponse.success(createdShop, "Táº¡o shop thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t thÃ´ng tin shop
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @PutMapping("/shop")
    public ApiResponse<Shop> updateShop(@RequestParam Long sellerId, @RequestBody Shop shop) {
        Shop updatedShop = sellerService.updateShop(sellerId, shop);
        return ApiResponse.success(updatedShop, "Cáº­p nháº­t shop thÃ nh cÃ´ng");
    }

    // ========== QUáº¢N LÃ Sáº¢N PHáº¨M (PRODUCT MANAGEMENT) ==========

    /**
     * Láº¥y danh sÃ¡ch sáº£n pháº©m cá»§a shop
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @GetMapping("/products")
    public ApiResponse<org.springframework.data.domain.Page<Product>> getMyProducts(
            @RequestParam Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        org.springframework.data.domain.Page<Product> products = sellerService.getMyProducts(sellerId, page, size);
        return ApiResponse.success(products, "Láº¥y danh sÃ¡ch sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o sáº£n pháº©m má»›i cho shop
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @PostMapping("/products")
    public ApiResponse<Product> createProduct(@RequestParam Long sellerId, @RequestBody Product product) {
        Product createdProduct = sellerService.createProduct(sellerId, product);
        return ApiResponse.success(createdProduct, "Táº¡o sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t sáº£n pháº©m
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @PutMapping("/products/{id}")
    public ApiResponse<Product> updateProduct(
            @RequestParam Long sellerId,
            @PathVariable Long id,
            @RequestBody Product product) {
        Product updatedProduct = sellerService.updateProduct(sellerId, id, product);
        return ApiResponse.success(updatedProduct, "Cáº­p nháº­t sáº£n pháº©m thÃ nh cÃ´ng");
    }

    /**
     * XÃ³a sáº£n pháº©m
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @DeleteMapping("/products/{id}")
    public ApiResponse<Void> deleteProduct(@RequestParam Long sellerId, @PathVariable Long id) {
        sellerService.deleteProduct(sellerId, id);
        return ApiResponse.success(null, "XÃ³a sáº£n pháº©m thÃ nh cÃ´ng");
    }

    // ========== THá»NG KÃŠ (STATISTICS) ==========

    /**
     * Xem thá»‘ng kÃª chi tiáº¿t cá»§a shop
     * Bao gá»“m doanh thu, Ä‘Æ¡n hÃ ng, sáº£n pháº©m bÃ¡n cháº¡y...
     * Quyá»n háº¡n: SELLER, ADMIN
     * 
     */
    @GetMapping("/statistics")
    public ApiResponse<SellerStatisticsDTO> getStatistics(@RequestParam Long sellerId) {
        SellerStatisticsDTO stats = statisticsService.getSellerStatistics(sellerId);
        return ApiResponse.success(stats, "Láº¥y thá»‘ng kÃª thÃ nh cÃ´ng");
    }
}
