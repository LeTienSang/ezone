package com.ezone.analytics;

import com.ezone.classroom.ClassRepository;
import com.ezone.classroom.ClassStatus;
import com.ezone.course.CourseCatalogRepository;
import com.ezone.payment.Payment;
import com.ezone.payment.PaymentRepository;
import com.ezone.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AnalyticsService {
    private final UserRepository userRepository;
    private final CourseCatalogRepository courseCatalogRepository;
    private final ClassRepository classRepository;
    private final PaymentRepository paymentRepository;

    public AnalyticsService(UserRepository userRepository,
                            CourseCatalogRepository courseCatalogRepository,
                            ClassRepository classRepository,
                            PaymentRepository paymentRepository) {
        this.userRepository = userRepository;
        this.courseCatalogRepository = courseCatalogRepository;
        this.classRepository = classRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCourses = courseCatalogRepository.count();
        BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(Payment.Status.SUCCESS);
        long activeClasses = classRepository.countByStatus(ClassStatus.ACTIVE);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCourses(totalCourses)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .activeClasses(activeClasses)
                .build();
    }
}