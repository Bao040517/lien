package com.liennganh.shopee.controller.flashsale;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.FlashSale;
import com.liennganh.shopee.service.product.FlashSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

/**
 * Controller quáº£n lÃ½ chÆ°Æ¡ng trÃ¬nh Flash Sale
 * Cho phÃ©p xem danh sÃ¡ch flash sale vÃ  quáº£n lÃ½ (Admin)
 */
@RestController
@RequestMapping("/api/flash-sales")
public class FlashSaleController {
    @Autowired
    private FlashSaleService flashSaleService;

    /**
     * Láº¥y toÃ n bá»™ danh sÃ¡ch Flash Sale (cáº£ cÅ© vÃ  má»›i)
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping
    public ApiResponse<List<FlashSale>> getAllFlashSales() {
        return ApiResponse.success(flashSaleService.getAllFlashSales(), "Láº¥y danh sÃ¡ch Flash Sale thÃ nh cÃ´ng");
    }

    /**
     * Láº¥y danh sÃ¡ch Flash Sale Ä‘ang diá»…n ra (Active)
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/current")
    public ApiResponse<List<FlashSale>> getCurrentFlashSales() {
        return ApiResponse.success(flashSaleService.getActiveFlashSales(),
                "Láº¥y danh sÃ¡ch Flash Sale Ä‘ang diá»…n ra thÃ nh cÃ´ng");
    }

    /**
     * Táº¡o chÆ°Æ¡ng trÃ¬nh Flash Sale má»›i
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        return ApiResponse.success(flashSaleService.createFlashSale(flashSale), "Táº¡o Flash Sale thÃ nh cÃ´ng");
    }

    /**
     * Cáº­p nháº­t thÃ´ng tin Flash Sale
     * Quyá»n háº¡n: ADMIN
     * 
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<FlashSale> updateFlashSale(@PathVariable Long id, @RequestBody FlashSale flashSale) {
        return ApiResponse.success(flashSaleService.updateFlashSale(id, flashSale), "Cáº­p nháº­t Flash Sale thÃ nh cÃ´ng");
    }
}

