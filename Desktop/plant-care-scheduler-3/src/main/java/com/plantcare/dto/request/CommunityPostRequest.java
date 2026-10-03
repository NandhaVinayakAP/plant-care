package com.plantcare.dto.request;

import com.plantcare.enums.ForumCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CommunityPostRequest {
    @NotNull
    private ForumCategory forumCategory;

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    private Long plantId;
    private List<String> tags;
}
