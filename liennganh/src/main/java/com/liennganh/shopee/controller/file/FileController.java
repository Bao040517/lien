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
 * Controller quáº£n lÃ½ File vÃ  áº¢nh
 * Cho phÃ©p upload vÃ  xem/download file
 */
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    /**
     * Upload má»™t file duy nháº¥t
     * Quyá»n háº¡n: USER, SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @PostMapping("/upload")
    public ApiResponse<String> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        return ApiResponse.success(fileName, "Upload file thÃ nh cÃ´ng");
    }

    /**
     * Upload nhiá»u file cÃ¹ng lÃºc (tá»‘i Ä‘a 5 file)
     * Quyá»n háº¡n: USER, SELLER, ADMIN
     * 
     */
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('USER', 'SELLER', 'ADMIN')")
    @PostMapping("/uploads")
    public ApiResponse<java.util.List<String>> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        if (files.length > 5) {
            throw new IllegalArgumentException("KhÃ´ng thá»ƒ upload quÃ¡ 5 file cÃ¹ng lÃºc");
        }
        java.util.List<String> fileNames = java.util.Arrays.stream(files)
                .map(fileStorageService::storeFile)
                .collect(java.util.stream.Collectors.toList());
        return ApiResponse.success(fileNames, "Upload nhiá»u file thÃ nh cÃ´ng");
    }

    /**
     * Xem hoáº·c táº£i xuá»‘ng file
     * Quyá»n háº¡n: Public
     * 
     */
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Táº£i file dÆ°á»›i dáº¡ng Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Cá»‘ gáº¯ng xÃ¡c Ä‘á»‹nh content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // logger.info("Could not determine file type.");
        }

        // Náº¿u khÃ´ng xÃ¡c Ä‘á»‹nh Ä‘Æ°á»£c, dÃ¹ng máº·c Ä‘á»‹nh
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}

