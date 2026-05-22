package com.ezone.payment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByEnrollmentId(Integer enrollmentId);
    Page<Payment> findByStatus(Payment.Status status, Pageable pageable);
}
