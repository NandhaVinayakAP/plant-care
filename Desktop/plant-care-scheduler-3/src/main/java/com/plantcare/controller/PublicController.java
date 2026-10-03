package com.plantcare.controller;

import com.plantcare.dto.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Public", description = "Public endpoints (no authentication required)")
public class PublicController {

    @GetMapping("/info")
    @Operation(summary = "Get application information")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "Plant Care Scheduler");
        info.put("version", "1.0.0");
        info.put("description", "Comprehensive plant care management system");
        info.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.success(info));
    }

    @GetMapping("/health")
    @Operation(summary = "Health check")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "plant-care-scheduler");
        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
