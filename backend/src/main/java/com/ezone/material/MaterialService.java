package com.ezone.material;

import com.ezone.classroom.ClassEntity;
import com.ezone.classroom.ClassRepository;
import com.ezone.common.exception.BadRequestException;
import com.ezone.common.exception.ForbiddenException;
import com.ezone.common.exception.ResourceNotFoundException;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Slf4j
@Service
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    public MaterialService(MaterialRepository materialRepository, 
                           ClassRepository classRepository,
                           UserRepository userRepository) {
        this.materialRepository = materialRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<Material> getMaterials(Integer classId, String username) {
        log.info("Fetching materials for class ID: {} by user: {}", classId, username);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        checkClassAccess(username, classEntity);

        return materialRepository.findByClassEntityId(classId);
    }

    @Transactional
    public Material uploadMaterial(Integer classId, String username, MultipartFile file, String title, String materialType) throws IOException {
        log.info("User {} is uploading material '{}' (type {}) for class ID {}", username, title, materialType, classId);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        if (classEntity.getInstructor() == null || 
            !classEntity.getInstructor().getUser().getUsername().equals(username)) {
            log.warn("User {} is not the instructor for class ID {}", username, classId);
            throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
        }

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File không được để trống");
        }

        String orig = file.getOriginalFilename();
        if (orig != null) {
            String lower = orig.toLowerCase();
            if (lower.endsWith(".exe") || lower.endsWith(".bat") || lower.endsWith(".sh") || lower.endsWith(".cmd") || lower.endsWith(".com")) {
                log.warn("Blocked unsupported file type upload: {}", orig);
                throw new BadRequestException("Định dạng file không được hỗ trợ");
            }
        }

        String fileUrl = saveFile(file, "materials");

        Material material = new Material();
        material.setClassEntity(classEntity);
        material.setTitle(title);
        material.setFileUrl(fileUrl);
        try {
            material.setMaterialType(Material.MaterialType.valueOf(materialType.toUpperCase()));
        } catch (IllegalArgumentException e) {
            log.warn("Invalid material type: {}", materialType);
            throw new BadRequestException("Loại tài liệu không hợp lệ: " + materialType);
        }

        Material saved = materialRepository.save(material);
        log.info("Material uploaded successfully: ID={}, url={}", saved.getId(), saved.getFileUrl());
        return saved;
    }

    @Transactional
    public void deleteMaterial(Integer classId, Integer materialId, String username) {
        log.info("User {} is deleting material ID {} from class ID {}", username, materialId, classId);
        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp học"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (user.getRole() == User.Role.TEACHER) {
            if (classEntity.getInstructor() == null || 
                !classEntity.getInstructor().getUser().getId().equals(user.getId())) {
                log.warn("Teacher {} is not assigned to class ID {}", username, classId);
                throw new ForbiddenException("Bạn không phải giảng viên phụ trách lớp học này");
            }
        }

        Material material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException("Tài liệu không tồn tại"));

        if (!material.getClassEntity().getId().equals(classId)) {
            log.warn("Material ID {} does not belong to class ID {}", materialId, classId);
            throw new BadRequestException("Tài liệu không thuộc lớp học này");
        }

        materialRepository.delete(material);
        log.info("Material ID {} deleted successfully", materialId);
    }

    private void checkClassAccess(String username, ClassEntity classEntity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        
        if (user.getRole() == User.Role.ADMIN) {
            return;
        }
        if (user.getRole() == User.Role.TEACHER) {
            if (classEntity.getInstructor() != null && 
                classEntity.getInstructor().getUser().getId().equals(user.getId())) {
                return;
            }
            throw new ForbiddenException("Bạn không có quyền truy cập lớp học này");
        }
        boolean isMember = classEntity.getStudents().contains(user);
        if (!isMember) {
            throw new ForbiddenException("Bạn không phải là thành viên của lớp học này");
        }
    }

    private String saveFile(MultipartFile file, String subFolder) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get("uploads", subFolder);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + subFolder + "/" + fileName;
    }
}
