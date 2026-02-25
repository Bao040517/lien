package com.liennganh.shopee.controller.file;

import com.liennganh.shopee.dto.response.ApiResponse;
import com.liennganh.shopee.service.common.FileStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

/**
 * Controller quản lý File và Ảnh
 * Cho phép upload và xem/download file
 */
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Upload một file duy nhất
     * Quyền hạn: USER, SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @PostMapping("/upload")
    public ApiResponse<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        return ApiResponse.success(fileName, "Upload file thành công");
    }

    /**
     * Upload nhiều file cùng lúc (tối đa 5 file)
     * Quyền hạn: USER, SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @PostMapping("/uploads")
    public ApiResponse<java.util.List<String>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        if (files.length > 5) {
            throw new IllegalArgumentException("Không thể upload quá 5 file cùng lúc");
        }
        java.util.List<String> fileNames = java.util.Arrays.stream(files)
                .map(fileStorageService::storeFile)
                .collect(java.util.stream.Collectors.toList());
        return ApiResponse.success(fileNames, "Upload nhiều file thành công");
    }

    /**
     * Xem hoặc tải xuống file
     * Quyền hạn: Public
     * 
     */
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Tải file dưới dạng Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Cố gắng xác định content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // logger.info("Could not determine file type.");
        }

        // Nếu không xác định được, dùng mặc định
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}

