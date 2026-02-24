package com.liennganh.shopee.service.slider;

import com.liennganh.shopee.entity.Slider;
import com.liennganh.shopee.repository.slider.SliderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SliderServiceImpl implements ISliderService {

    private final SliderRepository sliderRepository;

    @Override
    public List<Slider> getAllSliders() {
        return sliderRepository.findAll();
    }

    @Override
    public List<Slider> getActiveSliders() {
        return sliderRepository.findAllByIsActiveOrderByDisplayOrderAsc(true);
    }

    @Override
    public Slider getSliderById(Long id) {
        return sliderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slider không tồn tại với ID: " + id));
    }

    @Override
    public Slider createSlider(Slider slider) {
        if (slider.getDisplayOrder() == null) {
            slider.setDisplayOrder(0);
        }
        return sliderRepository.save(slider);
    }

    @Override
    public Slider updateSlider(Long id, Slider sliderDetails) {
        Slider existingSlider = getSliderById(id);
        existingSlider.setImageUrl(sliderDetails.getImageUrl());
        existingSlider.setTitle(sliderDetails.getTitle());
        existingSlider.setLink(sliderDetails.getLink());
        existingSlider.setDisplayOrder(sliderDetails.getDisplayOrder());
        existingSlider.setIsActive(sliderDetails.getIsActive());

        return sliderRepository.save(existingSlider);
    }

    @Override
    public void deleteSlider(Long id) {
        Slider existingSlider = getSliderById(id);
        sliderRepository.delete(existingSlider);
    }
}
