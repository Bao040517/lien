package com.liennganh.shopee.repository.slider;

import com.liennganh.shopee.entity.Slider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SliderRepository extends JpaRepository<Slider, Long> {
    List<Slider> findAllByIsActiveOrderByDisplayOrderAsc(Boolean isActive);
}
