package com.ezone.payment;

import com.ezone.common.dto.PageResponse;
import com.ezone.common.exception.BadRequestException;
import com.ezone.common.exception.ForbiddenException;
import com.ezone.common.exception.ResourceNotFoundException;
import com.ezone.enrollment.Enrollment;
import com.ezone.enrollment.EnrollmentRepository;
import com.ezone.user.User;
import com.ezone.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;

@Slf4j
@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public PaymentService(PaymentRepository paymentRepository, 
                          EnrollmentRepository enrollmentRepository,
                          UserRepository userRepository) {
        this.paymentRepository = paymentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Payment submitPayment(String username, Integer enrollmentId, String paymentMethod, String transactionId, MultipartFile receiptImage) throws IOException {
        log.info("Submitting payment proof for enrollment ID: {}, method: {}, txn ID: {}, by user: {}", enrollmentId, paymentMethod, transactionId, username);

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (receiptImage == null || receiptImage.isEmpty()) {
            throw new BadRequestException("Chưa tải lên ảnh minh chứng");
        }

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn đăng ký không tồn tại"));

        // Ownership check: only the enrollment owner can submit payment
        if (!enrollment.getUser().getId().equals(currentUser.getId())) {
            log.warn("User {} attempted to submit payment for enrollment {} owned by user {}", username, enrollmentId, enrollment.getUser().getUsername());
            throw new ForbiddenException("Bạn không có quyền thanh toán cho đơn đăng ký này");
        }

        // Guard: do not allow resetting an already approved payment back to PENDING
        Payment payment = paymentRepository.findByEnrollmentId(enrollmentId).orElse(new Payment());
        if (payment.getId() != null && payment.getStatus() == Payment.Status.SUCCESS) {
            throw new BadRequestException("Thanh toán đã được duyệt, không thể gửi lại");
        }

        String proofUrl = saveFile(receiptImage, "receipts");

        // Amount derived from course price on backend — never trust client
        BigDecimal amount = enrollment.getCourse().getPrice();

        payment.setEnrollment(enrollment);
        payment.setAmount(amount);
        payment.setPaymentMethod(paymentMethod);
        payment.setTransactionId(transactionId);
        payment.setProofUrl(proofUrl);
        payment.setStatus(Payment.Status.PENDING);
        payment.setPaymentDate(LocalDateTime.now());

        Payment saved = paymentRepository.save(payment);
        log.info("Payment proof saved successfully. Payment ID: {}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public PageResponse<Payment> getAllPayments(String status, int page, int size) {
        log.info("Fetching payments with status: {}, page: {}, size: {}", status, page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Payment> paymentPage;

        if (status != null && !status.trim().isEmpty()) {
            try {
                Payment.Status statusEnum = Payment.Status.valueOf(status.trim().toUpperCase());
                paymentPage = paymentRepository.findByStatus(statusEnum, pageable);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid payment status provided: {}", status);
                throw new BadRequestException("Trạng thái thanh toán không hợp lệ: " + status);
            }
        } else {
            paymentPage = paymentRepository.findAll(pageable);
        }

        return PageResponse.fromPage(paymentPage);
    }

    @Transactional(readOnly = true)
    public java.util.List<Payment> getMyPayments(String username) {
        log.info("Fetching payments for student: {}", username);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new com.ezone.common.exception.ResourceNotFoundException("Không tìm thấy người dùng"));
        return paymentRepository.findByEnrollmentUserIdOrderByPaymentDateDesc(user.getId());
    }

    @Transactional
    public Payment confirmPayment(Integer id) {
        log.info("Confirming payment ID: {}", id);
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch thanh toán"));

        payment.setStatus(Payment.Status.SUCCESS);
        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        Enrollment enrollment = payment.getEnrollment();
        enrollment.setStatus(Enrollment.Status.PAID);
        enrollmentRepository.save(enrollment);

        User user = enrollment.getUser();
        if (user.getRole() == User.Role.GUEST) {
            user.setRole(User.Role.STUDENT);
            userRepository.save(user);
            log.info("User {} upgraded from GUEST to STUDENT role", user.getUsername());
        }

        log.info("Payment ID {} confirmed successfully", id);
        return savedPayment;
    }

    @Transactional
    public Payment rejectPayment(Integer id, RejectRequest req) {
        log.info("Rejecting payment ID: {} for reason: {}", id, req.getReason());
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch thanh toán"));

        payment.setStatus(Payment.Status.FAILED);
        payment.setPaymentDate(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        Enrollment enrollment = payment.getEnrollment();
        enrollment.setStatus(Enrollment.Status.CANCELLED);
        enrollmentRepository.save(enrollment);

        log.info("Payment ID {} rejected successfully", id);
        return savedPayment;
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
