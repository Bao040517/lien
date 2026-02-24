package com.liennganh.shopee.controller.slider;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.entity.Slider;
import com.liennganh.shopee.service.slider.ISliderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sliders")
@RequiredArgsConstructor
public class SliderController {

    private final ISliderService sliderService;

    // Public: Láº¥y slider active cho trang Home
    @GetMapping("/active")
    public ApiResponse<List<Slider>> getActiveSliders() {
        List<Slider> sliders = sliderService.getActiveSliders();
        return ApiResponse.success(sliders, "Láº¥y danh sÃ¡ch slider thÃ nh cÃ´ng");
    }

    // Admin: Láº¥y táº¥t cáº£ slider
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ApiResponse<List<Slider>> getAllSliders() {
        return ApiResponse.success(sliderService.getAllSliders(), "Láº¥y táº¥t cáº£ slider thÃ nh cÃ´ng");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ApiResponse<Slider> getSliderById(@PathVariable Long id) {
        return ApiResponse.success(sliderService.getSliderById(id), "Láº¥y chi tiáº¿t slider thÃ nh cÃ´ng");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ApiResponse<Slider> createSlider(@RequestBody Slider slider) {
        return ApiResponse.success(sliderService.createSlider(slider), "ThÃªm slider thÃ nh cÃ´ng");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<Slider> updateSlider(@PathVariable Long id, @RequestBody Slider slider) {
        return ApiResponse.success(sliderService.updateSlider(id, slider), "Cáº­p nháº­t slider thÃ nh cÃ´ng");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSlider(@PathVariable Long id) {
        sliderService.deleteSlider(id);
        return ApiResponse.success(null, "XÃ³a slider thÃ nh cÃ´ng");
    }
}

