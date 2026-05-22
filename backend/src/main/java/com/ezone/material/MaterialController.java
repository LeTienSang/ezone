package com.ezone.material;

import com.ezone.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Tag(name = "Material Management", description = "Endpoints for uploading and sharing course materials")
@RestController
@RequestMapping("/api/v1/classes/{classId}/materials")
public class MaterialController {
    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @Operation(summary = "Get list of all materials in a classroom")
    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<Material>>> getMaterials(
            @PathVariable("classId") Integer classId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to get materials for class ID {} by user {}", classId, username);
        List<Material> list = materialService.getMaterials(classId, username);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @Operation(summary = "Upload new learning material to a classroom (Teacher only)")
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<ApiResponse<Material>> uploadMaterial(
            @PathVariable("classId") Integer classId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("materialType") String materialType) throws IOException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to upload material '{}' for class ID {} by instructor {}", title, classId, username);
        Material saved = materialService.uploadMaterial(classId, username, file, title, materialType);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Đăng tải tài liệu thành công"));
    }

    @Operation(summary = "Delete learning material from a classroom (Teacher/Admin only)")
    @DeleteMapping("/{materialId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMaterial(
            @PathVariable("classId") Integer classId,
            @PathVariable("materialId") Integer materialId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        log.info("REST request to delete material ID {} from class ID {} by user {}", materialId, classId, username);
        materialService.deleteMaterial(classId, materialId, username);
        return ResponseEntity.ok(ApiResponse.success(null, "Xóa tài liệu thành công"));
    }
}
