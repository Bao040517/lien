package com.liennganh.shopee.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO dữ liệu biểu đồ (Chart Data)
 * Dùng để vẽ biểu đồ doanh thu hoặc số lượng đơn hàng theo thời gian
 */
@NoArgsConstructor
public class ChartDataDTO {
    private String label; // Nhãn trục hoành (Ví dụ: "2023-10-27" hoặc "Tháng 10")
    private BigDecimal value; // Giá trị trục tung (Doanh thu hoặc Số lượng)

    public ChartDataDTO(String label, BigDecimal value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}
