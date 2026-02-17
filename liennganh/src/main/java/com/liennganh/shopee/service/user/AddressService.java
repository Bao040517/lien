package com.liennganh.shopee.service.user;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.entity.Address;
import com.liennganh.shopee.entity.User;
import com.liennganh.shopee.repository.user.AddressRepository;
import com.liennganh.shopee.repository.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service quản lý địa chỉ giao hàng của người dùng
 */
@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy danh sách địa chỉ của user
     * 
     */
    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    /**
     * Lấy tất cả địa chỉ (Admin - nếu cần)
     * 
     */
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    /**
     * Thêm địa chỉ mới
     * 
     * @throws AppException USER_NOT_FOUND
     */
    @Transactional
    public Address addAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        address.setUser(user);

        // Nếu đặt làm mặc định, reset các địa chỉ khác
        if (address.isDefault()) {
            resetDefaultAddress(userId);
        }

        return addressRepository.save(address);
    }

    /**
     * Cập nhật địa chỉ
     * 
     * @throws AppException ADDRESS_NOT_FOUND, NOT_ADDRESS_OWNER
     */
    @Transactional
    public Address updateAddress(Long userId, Long addressId, Address addressDetails) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        if (!address.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.NOT_ADDRESS_OWNER);
        }

        address.setRecipientName(addressDetails.getRecipientName());
        address.setPhoneNumber(addressDetails.getPhoneNumber());
        address.setStreet(addressDetails.getStreet());
        address.setCity(addressDetails.getCity());
        address.setDistrict(addressDetails.getDistrict());
        address.setWard(addressDetails.getWard());

        if (addressDetails.isDefault()) {
            resetDefaultAddress(userId);
            address.setDefault(true);
        }

        return addressRepository.save(address);
    }

    /**
     * Xóa địa chỉ
     * 
     * @throws AppException ADDRESS_NOT_FOUND, NOT_ADDRESS_OWNER
     */
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        if (!address.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.NOT_ADDRESS_OWNER);
        }

        addressRepository.delete(address);
    }

    /**
     * Helper: Reset trạng thái mặc định của các địa chỉ khác
     */
    private void resetDefaultAddress(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }
}
