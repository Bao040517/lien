package com.liennganh.shopee.service.auth;

import com.liennganh.shopee.dto.request.LoginRequest;
import com.liennganh.shopee.dto.request.RegisterRequest;
import com.liennganh.shopee.dto.response.LoginResponse;
import com.liennganh.shopee.dto.response.UserResponse;
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

/**
 * Service xử lý logic xác thực và ủy quyền (Authentication & Authorization)
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Đăng ký tài khoản người dùng mới (Role USER)
     * 
     * @throws AppException USERNAME_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Đang đăng ký user mới: {}", request.getUsername());

        // Ki?m tra username d� t?n t?i chua
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        // Ki?m tra email d� t?n t?i chua
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // M� h�a m?t kh?u
        user.setRole(User.Role.USER);
        user.setIsLocked(false);

        User savedUser = userRepository.save(user);
        log.info("Đăng ký user thành công: {}", savedUser.getUsername());

        return UserResponse.fromUser(savedUser);
    }

    /**
     * Đăng ký tài khoản người bán mới (Role SELLER)
     * User sẽ ở trạng thái PENDING chờ Admin duyệt
     * 
     * @throws AppException USERNAME_ALREADY_EXISTS, EMAIL_ALREADY_EXISTS
     */
    @Transactional
    public UserResponse registerSeller(RegisterRequest request) {
        log.info("Đang đăng ký seller mới: {}", request.getUsername());

        // Kiểm tra username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        // Kiểm tra email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // M� h�a m?t kh?u
        user.setRole(User.Role.SELLER);
        user.setSellerStatus(User.SellerStatus.PENDING); // Trạng thái chờ duyệt
        user.setIsLocked(false);

        User savedUser = userRepository.save(user);
        log.info("Đăng ký seller thành công (đang chờ duyệt): {}", savedUser.getUsername());

        return UserResponse.fromUser(savedUser);
    }

    /**
     * Đăng nhập hệ thống
     * 
     * @throws AppException INVALID_CREDENTIALS, USER_LOCKED,
     *                      SELLER_REJECTED/SUSPENDED
     */
    public LoginResponse login(LoginRequest request) {
        log.info("Yêu cầu đăng nhập từ user: {}", request.getUsername());

        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        // Kiểm tra tài khoản có bị khóa không
        if (Boolean.TRUE.equals(user.getIsLocked())) {
            throw new AppException(ErrorCode.USER_LOCKED);
        }

        // Kiểm tra trạng thái người bán (nếu là Seller)
        if (user.getRole() == User.Role.SELLER) {
            if (user.getSellerStatus() == User.SellerStatus.REJECTED) {
                throw new AppException(ErrorCode.SELLER_REJECTED);
            }
            if (user.getSellerStatus() == User.SellerStatus.SUSPENDED) {
                throw new AppException(ErrorCode.SELLER_SUSPENDED);
            }
        }

        // Tạo chuỗi JWT
        String token = jwtService.generateToken(user);

        log.info("User đăng nhập thành công: {}", user.getUsername());
        return new LoginResponse(UserResponse.fromUser(user), token);
    }

    /**
     * Lấy thông tin user (dùng cho API /me)
     * 
     */
    public UserResponse getUserResponseById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return UserResponse.fromUser(user);
    }

}
