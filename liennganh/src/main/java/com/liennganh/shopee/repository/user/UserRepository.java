package com.liennganh.shopee.repository.user;

import com.liennganh.shopee.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository quản lý dữ liệu người dùng
 */
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Tìm user theo username
     */
    Optional<User> findByUsername(String username);

    /**
     * Tìm user theo email
     */
    Optional<User> findByEmail(String email);

    /**
     * Tìm user theo username HOẶC email (thường dùng khi đăng nhập)
     */
    Optional<User> findByUsernameOrEmail(String username, String email);

    /**
     * Ki?m tra username d� t?n t?i chua
     */
    boolean existsByUsername(String username);

    /**
     * Ki?m tra email d� t?n t?i chua
     */
    boolean existsByEmail(String email);

    // ========== Role-based queries ==========

    /**
     * Tìm danh sách user theo Role (ADMIN, USER, SELLER)
     */
    List<User> findByRole(User.Role role);

    /**
     * Đếm số lượng user theo Role
     */
    Long countByRole(User.Role role);

    // ========== Seller status queries ==========

    /**
     * Tìm danh sách user theo trạng thái Seller (PENDING, APPROVED...)
     */
    List<User> findBySellerStatus(User.SellerStatus sellerStatus);

    /**
     * Tìm theo Role và trạng thái Seller
     */
    List<User> findByRoleAndSellerStatus(User.Role role, User.SellerStatus sellerStatus);

    /**
     * Đếm số lượng user theo Role và trạng thái Seller
     */
    Long countByRoleAndSellerStatus(User.Role role, User.SellerStatus sellerStatus);
}
