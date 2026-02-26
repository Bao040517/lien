package com.liennganh.shopee.service.admin;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

/**
 * Service quản lý các chức năng dành cho Admin
 * Bao gồm quản lý người dùng và duyệt/khóa người bán
 */

@Service
@RequiredArgsConstructor
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);
    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL = "!@#$%&*";
    private static final String ALL_CHARS = UPPER + LOWER + DIGITS + SPECIAL;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final com.liennganh.shopee.repository.shop.ShopRepository shopRepository;
    private final PasswordEncoder passwordEncoder;

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

    /**
     * Sinh mật khẩu ngẫu nhiên (10 ký tự)
     * Đảm bảo có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
     */
    private String generateRandomPassword() {
        int length = 10;
        StringBuilder sb = new StringBuilder(length);

        // Đảm bảo mỗi loại ký tự xuất hiện ít nhất 1 lần
        sb.append(UPPER.charAt(RANDOM.nextInt(UPPER.length())));
        sb.append(LOWER.charAt(RANDOM.nextInt(LOWER.length())));
        sb.append(DIGITS.charAt(RANDOM.nextInt(DIGITS.length())));
        sb.append(SPECIAL.charAt(RANDOM.nextInt(SPECIAL.length())));

        // Điền phần còn lại ngẫu nhiên
        for (int i = 4; i < length; i++) {
            sb.append(ALL_CHARS.charAt(RANDOM.nextInt(ALL_CHARS.length())));
        }

        // Xáo trộn thứ tự ký tự
        char[] chars = sb.toString().toCharArray();
        for (int i = chars.length - 1; i > 0; i--) {
            int j = RANDOM.nextInt(i + 1);
            char tmp = chars[i];
            chars[i] = chars[j];
            chars[j] = tmp;
        }

        return new String(chars);
    }

    /**
     * Reset mật khẩu người dùng bằng mật khẩu ngẫu nhiên (10 ký tự)
     * Dùng khi admin hỗ trợ seller/user quên mật khẩu
     *
     * @return mật khẩu mới (plain text) để admin gửi cho user
     * @throws AppException USER_NOT_FOUND nếu không tìm thấy
     */
    @Transactional
    public String resetUserPassword(Long userId) {
        User user = getUserById(userId);
        String newPassword = generateRandomPassword();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Đã reset mật khẩu user: {}", user.getUsername());
        return newPassword;
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

        // N?u d� duy?t r?i th� kh�ng l�m g�
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
            log.info("�� t?o Shop cho user: {}", approvedSeller.getUsername());
        } else {
            log.info("Shop d� t?n t?i cho user: {}", approvedSeller.getUsername());
        }

        log.info("�� duy?t seller: {}", seller.getUsername());

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
        log.info("�� t? ch?i seller: {}", seller.getUsername());

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
        log.info("�� t?m kh�a seller: {}", seller.getUsername());

        return suspendedSeller;
    }
}
