package com.liennganh.shopee.service.admin;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service quản lý các chức năng dành cho Admin
 * Bao gồm quản lý người dùng và duyệt/khóa người bán
 */

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final com.liennganh.shopee.repository.shop.ShopRepository shopRepository;

    // ========== QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT) ==========

    /**
     * Lấy danh sách tất cả người dùng
     * 
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Lấy thông tin user theo ID
     * 
     * @throws AppException USER_NOT_FOUND nếu không tìm thấy
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * Khóa tài khoản người dùng
     * 
     */
    @Transactional
    public User lockUser(Long userId) {
        User user = getUserById(userId);
        user.setIsLocked(true);
        User lockedUser = userRepository.save(user);
        log.info("Đã khóa tài khoản user: {}", user.getUsername());
        return lockedUser;
    }

    /**
     * Mở khóa tài khoản người dùng
     * 
     */
    @Transactional
    public User unlockUser(Long userId) {
        User user = getUserById(userId);
        user.setIsLocked(false);
        User unlockedUser = userRepository.save(user);
        log.info("Đã mở khóa tài khoản user: {}", user.getUsername());
        return unlockedUser;
    }

    // ========== QUẢN LÝ NGƯỜI BÁN (SELLER MANAGEMENT) ==========

    /**
     * Lấy danh sách người bán đang chờ duyệt (PENDING)
     * 
     */
    public List<User> getPendingSellers() {
        return userRepository.findBySellerStatus(User.SellerStatus.PENDING);
    }

    /**
     * Lấy danh sách tất cả người bán (Role SELLER)
     * 
     */
    public List<User> getAllSellers() {
        return userRepository.findByRole(User.Role.SELLER);
    }

    /**
     * Duyệt yêu cầu làm người bán
     * - Cập nhật role thành SELLER
     * - Cập nhật trạng thái thành APPROVED
     * - Tự động tạo Shop nếu chưa có
     * 
     */
    @Transactional
    public User approveSeller(Long sellerId) {
        User seller = getUserById(sellerId);

        // Nếu đã duyệt rồi thì không làm gì
        if (seller.getSellerStatus() == User.SellerStatus.APPROVED) {
            return seller;
        }

        seller.setRole(User.Role.SELLER);
        seller.setSellerStatus(User.SellerStatus.APPROVED);
        User approvedSeller = userRepository.save(seller);

        // Tự động tạo Shop
        boolean shopExists = shopRepository.existsByOwner(approvedSeller);
        if (!shopExists) {
            com.liennganh.shopee.entity.Shop shop = new com.liennganh.shopee.entity.Shop();
            shop.setOwner(approvedSeller);
            shop.setName(approvedSeller.getUsername() + "'s Shop");
            shop.setDescription("Chào mừng đến với cửa hàng của " + approvedSeller.getUsername() + "!");
            shopRepository.save(shop);
            log.info("Đã tạo Shop cho user: {}", approvedSeller.getUsername());
        } else {
            log.info("Shop đã tồn tại cho user: {}", approvedSeller.getUsername());
        }

        log.info("Đã duyệt seller: {}", seller.getUsername());

        return approvedSeller;
    }

    /**
     * Từ chối yêu cầu làm người bán
     * 
     * @throws AppException INVALID_INPUT nếu trạng thái không phải PENDING
     */
    @Transactional
    public User rejectSeller(Long sellerId) {
        User seller = getUserById(sellerId);

        if (seller.getSellerStatus() != User.SellerStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        seller.setSellerStatus(User.SellerStatus.REJECTED);
        User rejectedSeller = userRepository.save(seller);
        log.info("Đã từ chối seller: {}", seller.getUsername());

        return rejectedSeller;
    }

    /**
     * Tạm khóa quyền bán hàng
     * 
     * @throws AppException UNAUTHORIZED nếu không phải SELLER, INVALID_INPUT nếu
     *                      chưa được duyệt
     */
    @Transactional
    public User suspendSeller(Long sellerId) {
        User seller = getUserById(sellerId);

        if (seller.getRole() != User.Role.SELLER) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (seller.getSellerStatus() != User.SellerStatus.APPROVED) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        seller.setSellerStatus(User.SellerStatus.SUSPENDED);
        User suspendedSeller = userRepository.save(seller);
        log.info("Đã tạm khóa seller: {}", seller.getUsername());

        return suspendedSeller;
    }
}
