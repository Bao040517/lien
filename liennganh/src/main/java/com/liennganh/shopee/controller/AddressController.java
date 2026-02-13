package com.liennganh.shopee.controller;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.model.Address;
import com.liennganh.shopee.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @GetMapping
    public ApiResponse<List<Address>> getAllAddresses() {
        return ApiResponse.success(addressService.getAllAddresses(), "All addresses retrieved successfully");
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Address>> getUserAddresses(@PathVariable Long userId) {
        return ApiResponse.success(addressService.getUserAddresses(userId), "Addresses retrieved successfully");
    }

    @PostMapping("/user/{userId}")
    public ApiResponse<Address> addAddress(@PathVariable Long userId, @RequestBody Address address) {
        return ApiResponse.success(addressService.addAddress(userId, address), "Address added successfully");
    }

    @PutMapping("/user/{userId}/{addressId}")
    public ApiResponse<Address> updateAddress(@PathVariable Long userId, @PathVariable Long addressId,
            @RequestBody Address address) {
        return ApiResponse.success(addressService.updateAddress(userId, addressId, address),
                "Address updated successfully");
    }

    @DeleteMapping("/user/{userId}/{addressId}")
    public ApiResponse<String> deleteAddress(@PathVariable Long userId, @PathVariable Long addressId) {
        addressService.deleteAddress(userId, addressId);
        return ApiResponse.success("Address deleted successfully", "Success");
    }
}
