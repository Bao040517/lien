package com.liennganh.shopee.service;

import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import com.liennganh.shopee.model.Address;
import com.liennganh.shopee.model.User;
import com.liennganh.shopee.repository.AddressRepository;
import com.liennganh.shopee.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    @Transactional
    public Address addAddress(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        address.setUser(user);

        if (address.isDefault()) {
            resetDefaultAddress(userId);
        }

        return addressRepository.save(address);
    }

    @Transactional
    public Address updateAddress(Long userId, Long addressId, Address addressDetails) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this address"); // Should use custom exception
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

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this address");
        }

        addressRepository.delete(address);
    }

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
