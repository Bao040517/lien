package com.liennganh.shopee.controller.flashsale;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.FlashSale;
import com.liennganh.shopee.service.product.FlashSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

/**
 * Controller quản lý chương trình Flash Sale
 * Cho phép xem danh sách flash sale và quản lý (Admin)
 */
@RestController
@RequestMapping("/api/flash-sales")
public class FlashSaleController {
    @Autowired
    private FlashSaleService flashSaleService;

    /**
     * Lấy toàn bộ danh sách Flash Sale (cả cũ và mới)
     * Quyền hạn: Public
     * 
     */
    @GetMapping
    public ApiResponse<List<FlashSale>> getAllFlashSales() {
        return ApiResponse.success(flashSaleService.getAllFlashSales(), "Lấy danh sách Flash Sale thành công");
    }

    /**
     * Lấy danh sách Flash Sale đang diễn ra (Active)
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/current")
    public ApiResponse<List<FlashSale>> getCurrentFlashSales() {
        return ApiResponse.success(flashSaleService.getActiveFlashSales(),
                "Lấy danh sách Flash Sale đang diễn ra thành công");
    }

    /**
     * Tạo chương trình Flash Sale mới
     * Quyền hạn: ADMIN
     * 
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        return ApiResponse.success(flashSaleService.createFlashSale(flashSale), "Tạo Flash Sale thành công");
    }

    /**
     * Cập nhật thông tin Flash Sale
     * Quyền hạn: ADMIN
     * 
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<FlashSale> updateFlashSale(@PathVariable Long id, @RequestBody FlashSale flashSale) {
        return ApiResponse.success(flashSaleService.updateFlashSale(id, flashSale), "Cập nhật Flash Sale thành công");
    }
}

