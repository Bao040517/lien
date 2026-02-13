package com.liennganh.shopee.service;

import com.liennganh.shopee.dto.request.LoginRequest;
import com.liennganh.shopee.dto.request.RegisterRequest;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());

        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Plain text for now
        user.setRole(User.Role.USER);
        user.setIsLocked(false);

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getUsername());

        return UserResponse.fromUser(savedUser);
    }

    @Transactional
    public UserResponse registerSeller(RegisterRequest request) {
        log.info("Registering new seller: {}", request.getUsername());

        // Check if username exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        // Check if email exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // Plain text for now
        user.setRole(User.Role.SELLER);
        user.setSellerStatus(User.SellerStatus.PENDING); // Chờ admin duyệt
        user.setIsLocked(false);

        User savedUser = userRepository.save(user);
        log.info("Seller registered successfully (pending approval): {}", savedUser.getUsername());

        return UserResponse.fromUser(savedUser);
    }

    public UserResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());

        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        // Check password (plain text comparison for now)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        // Check if user is locked
        if (Boolean.TRUE.equals(user.getIsLocked())) {
            throw new AppException(ErrorCode.USER_LOCKED);
        }

        // Check seller status
        if (user.getRole() == User.Role.SELLER) {
            if (user.getSellerStatus() == User.SellerStatus.REJECTED) {
                throw new AppException(ErrorCode.SELLER_REJECTED);
            }
            if (user.getSellerStatus() == User.SellerStatus.SUSPENDED) {
                throw new AppException(ErrorCode.SELLER_SUSPENDED);
            }
        }

        log.info("User logged in successfully: {}", user.getUsername());
        return UserResponse.fromUser(user);
    }

    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserResponse.fromUser(user);
    }
}
