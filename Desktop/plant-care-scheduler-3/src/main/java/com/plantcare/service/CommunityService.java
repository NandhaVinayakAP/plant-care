package com.plantcare.service;

import com.plantcare.dto.request.CommunityPostRequest;
import com.plantcare.dto.response.CommunityPostResponse;
import com.plantcare.entity.CommunityPost;
import com.plantcare.entity.Plant;
import com.plantcare.entity.User;
import com.plantcare.enums.ForumCategory;
import com.plantcare.enums.PostStatus;
import com.plantcare.enums.UserRole;
import com.plantcare.exception.PlantCareException;
import com.plantcare.repository.CommunityPostRepository;
import com.plantcare.repository.PlantRepository;
import com.plantcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommunityService {

    @Autowired
    private CommunityPostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Transactional
    public CommunityPostResponse createPost(CommunityPostRequest request, Long userId) {
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new PlantCareException("User not found"));

        CommunityPost post = new CommunityPost();
        post.setAuthor(author);
        post.setForumCategory(request.getForumCategory());
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setStatus(PostStatus.PUBLISHED);
        post.setTags(request.getTags() != null ? String.join(",", request.getTags()) : null);

        if (request.getPlantId() != null) {
            Plant plant = plantRepository.findById(request.getPlantId())
                    .orElseThrow(() -> new PlantCareException("Plant not found"));
            post.setPlant(plant);
        }

        return mapToResponse(postRepository.save(post));
    }

    public Page<CommunityPostResponse> getPosts(ForumCategory category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByFilters(category, PostStatus.PUBLISHED, pageable)
                .map(this::mapToResponse);
    }

    public CommunityPostResponse getPostById(Long id) {
        CommunityPost post = postRepository.findById(id)
                .orElseThrow(() -> new PlantCareException("Post not found"));
        post.setViewCount(post.getViewCount() + 1);
        return mapToResponse(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id, Long userId) {
        CommunityPost post = postRepository.findById(id)
                .orElseThrow(() -> new PlantCareException("Post not found"));
        User user = userRepository.findById(userId).orElseThrow();

        if (!post.getAuthor().getId().equals(userId) && user.getRole() != UserRole.ADMIN) {
            throw new PlantCareException("You can only delete your own posts");
        }
        postRepository.delete(post);
    }

    private CommunityPostResponse mapToResponse(CommunityPost post) {
        return CommunityPostResponse.builder()
                .id(post.getId())
                .authorId(post.getAuthor().getId())
                .authorUsername(post.getAuthor().getUsername())
                .forumCategory(post.getForumCategory())
                .title(post.getTitle())
                .content(post.getContent())
                .plantId(post.getPlant() != null ? post.getPlant().getId() : null)
                .tags(post.getTags())
                .upvotes(post.getUpvotes())
                .downvotes(post.getDownvotes())
                .viewCount(post.getViewCount())
                .isPinned(post.getIsPinned())
                .status(post.getStatus())
                .createdDate(post.getCreatedDate())
                .build();
    }
}
