package com.plantcare.controller;

import com.plantcare.dto.request.CareTaskRequest;
import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.CareTaskResponse;
import com.plantcare.service.CareTaskService;
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
@RequestMapping("/api/care-tasks")
@Tag(name = "Care Tasks", description = "Care scheduling and task management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class CareTaskController {

    @Autowired
    private CareTaskService careTaskService;

    @PostMapping
    @Operation(summary = "Create a new care task")
    public ResponseEntity<ApiResponse<CareTaskResponse>> createTask(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CareTaskRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Task created", careTaskService.createTask(request, Long.parseLong(userId))));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get care task by ID")
    public ResponseEntity<ApiResponse<CareTaskResponse>> getTask(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(careTaskService.getTaskById(id, Long.parseLong(userId))));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update care task")
    public ResponseEntity<ApiResponse<CareTaskResponse>> updateTask(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CareTaskRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Task updated", careTaskService.updateTask(id, request, Long.parseLong(userId))));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete care task")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        careTaskService.deleteTask(id, Long.parseLong(userId));
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Mark task as completed")
    public ResponseEntity<ApiResponse<CareTaskResponse>> completeTask(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success("Task completed", careTaskService.completeTask(id, Long.parseLong(userId))));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming care tasks")
    public ResponseEntity<ApiResponse<List<CareTaskResponse>>> getUpcomingTasks(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(careTaskService.getUpcomingTasks(Long.parseLong(userId))));
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get overdue care tasks")
    public ResponseEntity<ApiResponse<List<CareTaskResponse>>> getOverdueTasks(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(careTaskService.getOverdueTasks(Long.parseLong(userId))));
    }
}
