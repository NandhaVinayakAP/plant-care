package com.plantcare.controller;

import com.plantcare.dto.request.HealthRecordRequest;
import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.HealthRecordResponse;
import com.plantcare.service.HealthRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-records")
@Tag(name = "Health Records", description = "Plant health monitoring endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    @PostMapping
    @Operation(summary = "Create a health record")
    public ResponseEntity<ApiResponse<HealthRecordResponse>> createRecord(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody HealthRecordRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Record created", healthRecordService.createRecord(request, Long.parseLong(userId))));
    }

    @GetMapping
    @Operation(summary = "Get health records for a plant")
    public ResponseEntity<ApiResponse<List<HealthRecordResponse>>> getRecords(
            @AuthenticationPrincipal String userId,
            @RequestParam Long plantId) {
        return ResponseEntity.ok(ApiResponse.success(healthRecordService.getRecordsByPlant(plantId, Long.parseLong(userId))));
    }
}
