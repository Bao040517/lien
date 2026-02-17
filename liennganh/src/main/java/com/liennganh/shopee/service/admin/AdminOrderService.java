package com.liennganh.shopee.service.admin;

import com.liennganh.shopee.entity.Order;
import com.liennganh.shopee.repository.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service quản lý đơn hàng dành cho Admin
 */
@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;

    /**
     * Lấy danh sách toàn bộ đơn hàng trong hệ thống
     * 
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
