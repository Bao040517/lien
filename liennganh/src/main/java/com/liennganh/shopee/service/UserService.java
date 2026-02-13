package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    public UserResponse requestSellerUpgrade(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // If already seller
        if (user.getRole() == User.Role.SELLER) {
            throw new AppException(ErrorCode.SELLER_ALREADY_REGISTERED);
        }

        // If already pending
        if (user.getSellerStatus() == User.SellerStatus.PENDING) {
            throw new AppException(ErrorCode.SELLER_ALREADY_REGISTERED);
        }

        // Keep role as USER, set status to PENDING
        user.setSellerStatus(User.SellerStatus.PENDING);

        // Ensure legacy data has isLocked set
        if (user.getIsLocked() == null) {
            user.setIsLocked(false);
        }

        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
}
