package com.liennganh.shopee.repository.user;

import com.liennganh.shopee.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository quản lý địa chỉ giao hàng
 */
public interface AddressRepository extends JpaRepository<Address, Long> {
    /**
     * Lấy danh sách địa chỉ của một user cụ thể
     * 
     */
    List<Address> findByUserId(Long userId);
}
