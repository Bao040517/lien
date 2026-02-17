package com.liennganh.shopee.service.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.liennganh.shopee.exception.AppException;
import com.liennganh.shopee.exception.ErrorCode;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service quản lý lưu trữ File (chủ yếu là ảnh)
 * Lưu file vào thư mục local của server
 */
@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    /**
     * Khởi tạo thư mục upload khi ứng dụng start
     */
    @PostConstruct
    public void init() {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            if (!Files.exists(this.uploadPath)) {
                Files.createDirectories(this.uploadPath);
            }
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_STORAGE_ERROR);
        }
    }

    /**
     * Lưu file vào hệ thống
     * 
     * @throws AppException FILE_STORAGE_ERROR nếu lỗi IO
     */
    public String storeFile(MultipartFile file) {
        try {
            // Lấy extension của file gốc
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            // Tạo tên file ngẫu nhiên để tránh trùng lặp
            String newFileName = UUID.randomUUID().toString() + extension;

            // Lưu file
            Path targetLocation = this.uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return newFileName;
        } catch (IOException ex) {
            throw new AppException(ErrorCode.FILE_STORAGE_ERROR);
        }
    }

    /**
     * Tải file dưới dạng Resource để trả về client
     * 
     * @throws AppException FILE_NOT_FOUND nếu không tìm thấy hoặc lỗi đường dẫn
     */
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.uploadPath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new AppException(ErrorCode.FILE_NOT_FOUND);
            }
        } catch (MalformedURLException ex) {
            throw new AppException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    /**
     * Lấy đường dẫn tuyệt đối của file (Utility method)
     */
    public Path getFilePath(String fileName) {
        return this.uploadPath.resolve(fileName).normalize();
    }
}
