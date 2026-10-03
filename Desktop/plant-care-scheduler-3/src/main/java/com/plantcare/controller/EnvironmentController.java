package com.plantcare.controller;

import com.plantcare.dto.request.EnvironmentDataRequest;
import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.EnvironmentDataResponse;
import com.plantcare.enums.DataSource;
import com.plantcare.service.EnvironmentService;
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
@RequestMapping("/api/environment")
@Tag(name = "Environment", description = "Environmental monitoring endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class EnvironmentController {

    @Autowired
    private EnvironmentService environmentService;

    @PostMapping("/manual-entry")
    @Operation(summary = "Record manual environment data")
    public ResponseEntity<ApiResponse<EnvironmentDataResponse>> recordData(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody EnvironmentDataRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Data recorded", environmentService.recordData(request, Long.parseLong(userId))));
    }

    @PostMapping("/sensor-data")
    @Operation(summary = "Record IoT sensor data")
    public ResponseEntity<ApiResponse<EnvironmentDataResponse>> recordSensorData(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody EnvironmentDataRequest request) {
        request.setDataSource(DataSource.SENSOR);
        return ResponseEntity.ok(ApiResponse.success("Sensor data recorded", environmentService.recordData(request, Long.parseLong(userId))));
    }

    @GetMapping
    @Operation(summary = "Get environment data for a plant")
    public ResponseEntity<ApiResponse<List<EnvironmentDataResponse>>> getData(
            @AuthenticationPrincipal String userId,
            @RequestParam Long plantId) {
        return ResponseEntity.ok(ApiResponse.success(environmentService.getDataByPlant(plantId, Long.parseLong(userId))));
    }

    @GetMapping("/{plantId}/current")
    @Operation(summary = "Get current environmental conditions")
    public ResponseEntity<ApiResponse<EnvironmentDataResponse>> getCurrentConditions(
            @PathVariable Long plantId,
            @AuthenticationPrincipal String userId) {
        EnvironmentDataResponse data = environmentService.getCurrentConditions(plantId, Long.parseLong(userId));
        if (data == null) {
            return ResponseEntity.ok(ApiResponse.success("No data available", null));
        }
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
