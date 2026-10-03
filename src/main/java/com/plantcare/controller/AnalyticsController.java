package com.plantcare.controller;

import com.plantcare.dto.response.ApiResponse;
import com.plantcare.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Analytics and insights endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/plants/{plantId}/summary")
    @Operation(summary = "Get plant analytics summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlantAnalytics(@PathVariable Long plantId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getPlantAnalytics(plantId)));
    }

    @GetMapping("/care-effectiveness")
    @Operation(summary = "Get care effectiveness analysis")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCareEffectiveness(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getCareEffectiveness(Long.parseLong(userId))));
    }

    @GetMapping("/system/usage")
    @Operation(summary = "Get system usage analytics (admin)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getSystemAnalytics()));
    }
}
