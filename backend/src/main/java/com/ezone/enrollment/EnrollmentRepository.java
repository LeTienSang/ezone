package com.ezone.enrollment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {
    Page<Enrollment> findByStatus(Enrollment.Status status, Pageable pageable);
    
    List<Enrollment> findByUserUsername(String username);
    
    List<Enrollment> findByUserUsernameAndStatus(String username, Enrollment.Status status);
    
    @Query("SELECT e FROM Enrollment e WHERE e.user.username = :username AND e.status = :status AND NOT EXISTS (SELECT 1 FROM Payment p WHERE p.enrollment = e)")
    List<Enrollment> findByUserUsernameAndStatusAndNoPayment(
        @Param("username") String username, 
        @Param("status") Enrollment.Status status
    );
}