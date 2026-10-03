package com.plantcare.controller;

import com.plantcare.dto.request.PlantCreateRequest;
import com.plantcare.dto.request.PlantSearchRequest;
import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.DashboardSummary;
import com.plantcare.dto.response.PlantResponse;
import com.plantcare.enums.HealthStatus;
import com.plantcare.service.PlantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
@Tag(name = "Plants", description = "Plant management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class PlantController {

    @Autowired
    private PlantService plantService;

    @PostMapping
    @Operation(summary = "Create a new plant profile")
    public ResponseEntity<ApiResponse<PlantResponse>> createPlant(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody PlantCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Plant created", plantService.createPlant(Long.parseLong(userId), request)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get plant by ID")
    public ResponseEntity<ApiResponse<PlantResponse>> getPlant(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(plantService.getPlantById(id, Long.parseLong(userId))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update plant")
    public ResponseEntity<ApiResponse<PlantResponse>> updatePlant(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody PlantCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Plant updated", plantService.updatePlant(id, Long.parseLong(userId), request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete (deactivate) plant")
    public ResponseEntity<ApiResponse<Void>> deletePlant(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        plantService.deletePlant(id, Long.parseLong(userId));
        return ResponseEntity.ok(ApiResponse.success("Plant deleted", null));
    }

    @GetMapping
    @Operation(summary = "Get all plants for authenticated user")
    public ResponseEntity<ApiResponse<Page<PlantResponse>>> getAllPlants(
            @AuthenticationPrincipal String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(ApiResponse.success(plantService.getPlantsByOwner(Long.parseLong(userId), page, size, sort)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search plants with filters")
    public ResponseEntity<ApiResponse<Page<PlantResponse>>> searchPlants(
            @AuthenticationPrincipal String userId,
            @ModelAttribute PlantSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(plantService.searchPlants(Long.parseLong(userId), request, page, size)));
    }

    @GetMapping("/needing-attention")
    @Operation(summary = "Get plants needing attention")
    public ResponseEntity<ApiResponse<List<PlantResponse>>> getNeedingAttention(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(plantService.getPlantsNeedingAttention(Long.parseLong(userId))));
    }

    @GetMapping("/dashboard-summary")
    @Operation(summary = "Get dashboard summary")
    public ResponseEntity<ApiResponse<DashboardSummary>> getDashboard(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(plantService.getDashboardSummary(Long.parseLong(userId))));
    }

    @PutMapping("/{id}/health-status")
    @Operation(summary = "Update plant health status")
    public ResponseEntity<ApiResponse<PlantResponse>> updateHealthStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId,
            @RequestParam HealthStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Health status updated",
                plantService.updateHealthStatus(id, Long.parseLong(userId), status)));
    }
}
