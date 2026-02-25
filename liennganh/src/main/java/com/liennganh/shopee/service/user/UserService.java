package com.liennganh.shopee.service.user;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.dto.response.UserResponse;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service quản lý thông tin người dùng
 */
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách tất cả người dùng (Admin)
     * 
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Lấy thông tin user theo ID
     * 
     * @throws AppException USER_NOT_FOUND
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    /**
     * Yêu cầu nâng cấp tài khoản lên SELLER
     * 
     * @throws AppException USER_NOT_FOUND, SELLER_ALREADY_REGISTERED
     */
    public UserResponse requestSellerUpgrade(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Ki?m tra n?u d� l� Seller
        if (user.getRole() == User.Role.SELLER) {
            throw new AppException(ErrorCode.SELLER_ALREADY_REGISTERED);
        }

        // Kiểm tra nếu đang chờ duyệt
        if (user.getSellerStatus() == User.SellerStatus.PENDING) {
            throw new AppException(ErrorCode.SELLER_ALREADY_REGISTERED);
        }

        // Giữ nguyên role là USER, chỉ set trạng thái seller là PENDING
        // Admin sẽ duyệt và chuyển role thành SELLER sau
        user.setSellerStatus(User.SellerStatus.PENDING);

        // Đảm bảo dữ liệu legacy không bị lỗi
        if (user.getIsLocked() == null) {
            user.setIsLocked(false);
        }

        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
}
