package com.plantcare.controller;

import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.UserResponse;
import com.plantcare.service.SpecialistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/specialist")
@Tag(name = "Specialists", description = "Specialist consultation endpoints")
public class SpecialistController {

    @Autowired
    private SpecialistService specialistService;

    @GetMapping
    @Operation(summary = "Get all specialists")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllSpecialists() {
        return ResponseEntity.ok(ApiResponse.success(specialistService.getAllSpecialists()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specialist by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getSpecialist(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(specialistService.getSpecialistById(id)));
    }
}
