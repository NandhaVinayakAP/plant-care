package com.plantcare.controller;

import com.plantcare.dto.request.ConsultationRequest;
import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.ConsultationResponse;
import com.plantcare.service.SpecialistService;
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
@RequestMapping("/api/consultations")
@Tag(name = "Consultations", description = "Consultation booking and management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class ConsultationController {

    @Autowired
    private SpecialistService specialistService;

    @PostMapping("/book")
    @Operation(summary = "Book a new consultation")
    public ResponseEntity<ApiResponse<ConsultationResponse>> bookConsultation(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ConsultationRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Consultation booked",
                specialistService.bookConsultation(request, Long.parseLong(userId))));
    }

    @GetMapping("/my-appointments")
    @Operation(summary = "Get my consultations")
    public ResponseEntity<ApiResponse<List<ConsultationResponse>>> getMyConsultations(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(specialistService.getMyConsultations(Long.parseLong(userId))));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Complete a consultation")
    public ResponseEntity<ApiResponse<ConsultationResponse>> completeConsultation(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) Integer rating) {
        return ResponseEntity.ok(ApiResponse.success("Consultation completed",
                specialistService.completeConsultation(id, notes, rating, Long.parseLong(userId))));
    }
}
