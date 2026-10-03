package com.plantcare.controller;

import com.plantcare.dto.request.CommunityPostRequest;
import com.plantcare.dto.response.ApiResponse;
import com.plantcare.dto.response.CommunityPostResponse;
import com.plantcare.enums.ForumCategory;
import com.plantcare.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community")
@Tag(name = "Community", description = "Community features and forums")
@SecurityRequirement(name = "Bearer Authentication")
public class CommunityController {

    @Autowired
    private CommunityService communityService;

    @GetMapping("/forums")
    @Operation(summary = "Get community forum posts")
    public ResponseEntity<ApiResponse<Page<CommunityPostResponse>>> getForums(
            @RequestParam(required = false) ForumCategory category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(communityService.getPosts(category, page, size)));
    }

    @GetMapping("/posts/{id}")
    @Operation(summary = "Get post by ID")
    public ResponseEntity<ApiResponse<CommunityPostResponse>> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(communityService.getPostById(id)));
    }

    @PostMapping("/forums/posts")
    @Operation(summary = "Create a new post")
    public ResponseEntity<ApiResponse<CommunityPostResponse>> createPost(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody CommunityPostRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Post created", communityService.createPost(request, Long.parseLong(userId))));
    }

    @DeleteMapping("/posts/{id}")
    @Operation(summary = "Delete a post")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal String userId) {
        communityService.deletePost(id, Long.parseLong(userId));
        return ResponseEntity.ok(ApiResponse.success("Post deleted", null));
    }
}
