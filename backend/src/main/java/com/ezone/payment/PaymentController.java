package com.ezone.payment;

import com.ezone.common.dto.ApiResponse;
import com.ezone.common.dto.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@Slf4j
@Tag(name = "Payment Management", description = "Endpoints for student payment submissions and verification")
@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @Operation(summary = "Submit payment receipt/proof for enrollment")
    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('STUDENT', 'GUEST')")
    public ResponseEntity<ApiResponse<Payment>> submitPayment(
            @RequestParam("enrollmentId") Integer enrollmentId,
            @RequestParam("amount") BigDecimal amount,
            @RequestParam("paymentMethod") String paymentMethod,
            @RequestParam("transactionId") String transactionId,
            @RequestParam("receiptImage") MultipartFile receiptImage) throws IOException {
        log.info("REST request to submit payment proof for enrollment ID: {}", enrollmentId);
        Payment saved = paymentService.submitPayment(enrollmentId, amount, paymentMethod, transactionId, receiptImage);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Gửi minh chứng thanh toán thành công"));
    }

    @Operation(summary = "Get paginated list of all payments (Admin only)")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<Payment>>> getAllPayments(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("REST request to get all payments with status: {}, page: {}, size: {}", status, page, size);
        PageResponse<Payment> payments = paymentService.getAllPayments(status, page, size);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    @Operation(summary = "Confirm student payment and upgrade role (Admin only)")
    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> confirmPayment(@PathVariable("id") Integer id) {
        log.info("REST request to confirm payment ID: {}", id);
        Payment savedPayment = paymentService.confirmPayment(id);
        return ResponseEntity.ok(ApiResponse.success(savedPayment, "Xác nhận thanh toán thành công"));
    }

    @Operation(summary = "Reject student payment (Admin only)")
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Payment>> rejectPayment(
            @PathVariable("id") Integer id,
            @Valid @RequestBody RejectRequest req) {
        log.info("REST request to reject payment ID: {}", id);
        Payment savedPayment = paymentService.rejectPayment(id, req);
        return ResponseEntity.ok(ApiResponse.success(savedPayment, "Đã từ chối thanh toán: " + req.getReason()));
    }
}
