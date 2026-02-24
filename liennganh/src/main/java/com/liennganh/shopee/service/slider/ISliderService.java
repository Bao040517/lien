package com.liennganh.shopee.service.slider;

import com.liennganh.shopee.entity.Slider;
import java.util.List;

public interface ISliderService {
    List<Slider> getAllSliders();

    List<Slider> getActiveSliders();

    Slider getSliderById(Long id);

    Slider createSlider(Slider slider);

    Slider updateSlider(Long id, Slider sliderDetails);

    void deleteSlider(Long id);
}
