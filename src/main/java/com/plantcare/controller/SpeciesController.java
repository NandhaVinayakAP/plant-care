package com.plantcare.controller;

import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.SpeciesResponse;
import com.plantcare.enums.CareDifficulty;
import com.plantcare.service.SpeciesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/species")
@Tag(name = "Species", description = "Plant species database endpoints")
public class SpeciesController {

    @Autowired
    private SpeciesService speciesService;

    @GetMapping
    @Operation(summary = "Get all species (paginated)")
    public ResponseEntity<ApiResponse<Page<SpeciesResponse>>> getAllSpecies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) CareDifficulty difficulty,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.success(speciesService.getAllSpecies(page, size, difficulty, search)));
    }

    @GetMapping("/public")
    @Operation(summary = "Get all species (public access)")
    public ResponseEntity<ApiResponse<Page<SpeciesResponse>>> getAllSpeciesPublic(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) CareDifficulty difficulty) {
        return ResponseEntity.ok(ApiResponse.success(speciesService.getAllSpecies(page, size, difficulty, null)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get species by ID")
    public ResponseEntity<ApiResponse<SpeciesResponse>> getSpeciesById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(speciesService.getSpeciesById(id)));
    }

    @GetMapping("/popular")
    @Operation(summary = "Get popular species")
    public ResponseEntity<ApiResponse<List<SpeciesResponse>>> getPopularSpecies() {
        return ResponseEntity.ok(ApiResponse.success(speciesService.getPopularSpecies()));
    }
}
