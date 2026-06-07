package com.ezone.analytics;

import com.ezone.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(name = "Analytics", description = "Dashboard KPI endpoints for admin")
@RestController
@RequestMapping("/api/v1/admin/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Operation(summary = "Get dashboard stats for admin")
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        log.info("REST request to get dashboard analytics stats");
        DashboardStatsResponse stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Tải thống kê dashboard thành công"));
    }

    @Operation(summary = "Get new users time-series (last N days)")
    @GetMapping("/new-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TimeSeriesResponse>> getNewUsersSeries(@org.springframework.web.bind.annotation.RequestParam(defaultValue = "7") int days) {
        TimeSeriesResponse res = analyticsService.getNewUsersSeries(days);
        return ResponseEntity.ok(ApiResponse.success(res, "Tải dữ liệu người dùng mới thành công"));
    }

    @Operation(summary = "Get monthly revenue time-series (last N months)")
    @GetMapping("/revenue-monthly")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TimeSeriesResponse>> getMonthlyRevenueSeries(@org.springframework.web.bind.annotation.RequestParam(defaultValue = "6") int months) {
        TimeSeriesResponse res = analyticsService.getMonthlyRevenueSeries(months);
        return ResponseEntity.ok(ApiResponse.success(res, "Tải dữ liệu doanh thu theo tháng thành công"));
    }
}