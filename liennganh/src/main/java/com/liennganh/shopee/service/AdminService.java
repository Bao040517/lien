package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final com.liennganh.shopee.repository.ShopRepository shopRepository;

    // User Management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    public User lockUser(Long userId) {
        User user = getUserById(userId);
        user.setIsLocked(true);
        User lockedUser = userRepository.save(user);
        log.info("User locked: {}", user.getUsername());
        return lockedUser;
    }

    @Transactional
    public User unlockUser(Long userId) {
        User user = getUserById(userId);
        user.setIsLocked(false);
        User unlockedUser = userRepository.save(user);
        log.info("User unlocked: {}", user.getUsername());
        return unlockedUser;
    }

    // Seller Management
    public List<User> getPendingSellers() {
        return userRepository.findBySellerStatus(User.SellerStatus.PENDING);
    }

    public List<User> getAllSellers() {
        return userRepository.findByRole(User.Role.SELLER);
    }

    @Transactional
    public User approveSeller(Long sellerId) {
        User seller = getUserById(sellerId);

        // Allow approving from PENDING, SUSPENDED, or REJECTED
        if (seller.getSellerStatus() == User.SellerStatus.APPROVED) {
            return seller; // Already approved
        }

        seller.setRole(User.Role.SELLER);
        seller.setSellerStatus(User.SellerStatus.APPROVED);
        User approvedSeller = userRepository.save(seller);

        // Create Shop automatically if not exists
        boolean shopExists = shopRepository.existsByOwner(approvedSeller);
        if (!shopExists) {
            com.liennganh.shopee.model.Shop shop = new com.liennganh.shopee.model.Shop();
            shop.setOwner(approvedSeller);
            shop.setName(approvedSeller.getUsername() + "'s Shop");
            shop.setDescription("Welcome to " + approvedSeller.getUsername() + "'s Shop!");
            shopRepository.save(shop);
            log.info("Shop created for user: {}", approvedSeller.getUsername());
        } else {
            log.info("Shop already exists for user: {}", approvedSeller.getUsername());
        }

        log.info("Seller approved: {}", seller.getUsername());

        return approvedSeller;
    }

    @Transactional
    public User rejectSeller(Long sellerId) {
        User seller = getUserById(sellerId);

        if (seller.getSellerStatus() != User.SellerStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_INPUT);
        }

        seller.setSellerStatus(User.SellerStatus.REJECTED);
        User rejectedSeller = userRepository.save(seller);
        log.info("Seller rejected: {}", seller.getUsername());

        return rejectedSeller;
    }

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
        log.info("Seller suspended: {}", seller.getUsername());

        return suspendedSeller;
    }
}
