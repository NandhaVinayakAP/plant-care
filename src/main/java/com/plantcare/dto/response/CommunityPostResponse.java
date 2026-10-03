package com.plantcare.dto.response;

import com.plantcare.enums.ForumCategory;
import com.plantcare.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityPostResponse {
    private Long id;
    private Long authorId;
    private String authorUsername;
    private ForumCategory forumCategory;
    private String title;
    private String content;
    private Long plantId;
    private String tags;
    private Integer upvotes;
    private Integer downvotes;
    private Integer viewCount;
    private Boolean isPinned;
    private PostStatus status;
    private LocalDateTime createdDate;
}
