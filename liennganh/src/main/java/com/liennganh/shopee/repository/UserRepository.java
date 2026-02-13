package com.liennganh.shopee.repository;

import com.liennganh.shopee.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // Role-based queries
    List<User> findByRole(User.Role role);

    Long countByRole(User.Role role);

    // Seller status queries
    List<User> findBySellerStatus(User.SellerStatus sellerStatus);

    List<User> findByRoleAndSellerStatus(User.Role role, User.SellerStatus sellerStatus);

    Long countByRoleAndSellerStatus(User.Role role, User.SellerStatus sellerStatus);
}
