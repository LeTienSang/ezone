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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public TimeSeriesResponse getNewUsersSeries(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.minusDays(days - 1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        List<Object[]> raw = userRepository.countNewUsersGroupedByDate(start);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, Long> map = new HashMap<>();
        for (Object[] row : raw) {
            String d = String.valueOf(row[0]);
            Number c = (Number) row[1];
            map.put(d, c.longValue());
        }

        List<String> labels = new ArrayList<>();
        List<BigDecimal> values = new ArrayList<>();
        for (int i = 0; i < days; i++) {
            LocalDate day = start.toLocalDate().plusDays(i);
            String label = day.format(fmt);
            labels.add(label);
            values.add(BigDecimal.valueOf(map.getOrDefault(label, 0L)));
        }

        return TimeSeriesResponse.builder().labels(labels).values(values).build();
    }

    @Transactional(readOnly = true)
    public TimeSeriesResponse getMonthlyRevenueSeries(int months) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.minusMonths(months - 1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        List<Object[]> raw = paymentRepository.sumAmountGroupedByMonth(start, Payment.Status.SUCCESS.name());

        Map<String, BigDecimal> map = new HashMap<>();
        for (Object[] row : raw) {
            String m = String.valueOf(row[0]);
            Number s = (Number) row[1];
            map.put(m, new BigDecimal(s.toString()));
        }

        List<String> labels = new ArrayList<>();
        List<BigDecimal> values = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM");
        LocalDate startMonth = start.toLocalDate();
        for (int i = 0; i < months; i++) {
            LocalDate m = startMonth.plusMonths(i);
            String label = m.format(fmt);
            labels.add(label);
            values.add(map.getOrDefault(label, BigDecimal.ZERO));
        }

        return TimeSeriesResponse.builder().labels(labels).values(values).build();
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCourses = courseCatalogRepository.countByIsVisibleTrue();
        BigDecimal totalRevenue = paymentRepository.sumAmountByStatus(Payment.Status.SUCCESS);
        long activeClasses = classRepository.countByStatus(ClassStatus.ACTIVE) + classRepository.countByStatus(ClassStatus.UPCOMING);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCourses(totalCourses)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .activeClasses(activeClasses)
                .build();
    }
}