package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.FlashSale;
import com.liennganh.shopee.service.FlashSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/flash-sales")
public class FlashSaleController {
    @Autowired
    private FlashSaleService flashSaleService;

    @GetMapping
    public ApiResponse<List<FlashSale>> getAllFlashSales() {
        return ApiResponse.success(flashSaleService.getAllFlashSales(), "All flash sales retrieved successfully");
    }

    @GetMapping("/current")
    public ApiResponse<List<FlashSale>> getCurrentFlashSales() {
        return ApiResponse.success(flashSaleService.getActiveFlashSales(), "Active flash sales retrieved successfully");
    }

    @PostMapping
    public ApiResponse<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        return ApiResponse.success(flashSaleService.createFlashSale(flashSale), "Flash sale created successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<FlashSale> updateFlashSale(@PathVariable Long id, @RequestBody FlashSale flashSale) {
        return ApiResponse.success(flashSaleService.updateFlashSale(id, flashSale), "Flash sale updated successfully");
    }
}
