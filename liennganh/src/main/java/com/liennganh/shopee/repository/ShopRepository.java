package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.Shop;
import com.liennganh.shopee.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShopRepository extends JpaRepository<Shop, Long> {
    boolean existsByOwner(User owner);

    Optional<Shop> findByOwner(User owner);
}
