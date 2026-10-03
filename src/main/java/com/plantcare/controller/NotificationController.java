package com.plantcare.controller;

import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.NotificationResponse;
import com.plantcare.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "User notifications endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get user notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUserNotifications(Long.parseLong(userId))));
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnread(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getUnreadNotifications(Long.parseLong(userId))));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        notificationService.markAsRead(id, Long.parseLong(userId));
        return ResponseEntity.ok(ApiResponse.success("Marked as read", null));
    }
}
