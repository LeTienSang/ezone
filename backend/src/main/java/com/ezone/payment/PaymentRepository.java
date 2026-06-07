package com.ezone.payment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByEnrollmentId(Integer enrollmentId);
    Page<Payment> findByStatus(Payment.Status status, Pageable pageable);
    java.util.List<Payment> findByEnrollmentUserIdOrderByPaymentDateDesc(Integer userId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") Payment.Status status);

    @Query(value = "SELECT DATE_FORMAT(p.payment_date, '%Y-%m') as m, COALESCE(SUM(p.amount),0) as s FROM PAYMENTS p WHERE p.payment_date >= :start AND p.status = :status GROUP BY m ORDER BY m", nativeQuery = true)
    java.util.List<Object[]> sumAmountGroupedByMonth(@Param("start") java.time.LocalDateTime start, @Param("status") String status);
}
