package com.plantcare.repository;

import com.plantcare.entity.CommunityPost;
import com.plantcare.enums.ForumCategory;
import com.plantcare.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    @Query("SELECT p FROM CommunityPost p WHERE (:category IS NULL OR p.forumCategory = :category) " +
           "AND p.status = :status ORDER BY p.isPinned DESC, p.createdDate DESC")
    Page<CommunityPost> findByFilters(@Param("category") ForumCategory category,
                                       @Param("status") PostStatus status,
                                       Pageable pageable);

    List<CommunityPost> findByAuthorIdOrderByCreatedDateDesc(Long authorId);
}
