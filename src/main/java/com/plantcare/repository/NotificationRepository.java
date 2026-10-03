package com.plantcare.repository;

import com.plantcare.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdDate DESC")
    List<Notification> findByUserIdOrderByCreatedDateDesc(@Param("userId") Long userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdDate DESC")
    List<Notification> findUnreadByUserId(@Param("userId") Long userId);

    Long countByUserIdAndIsReadFalse(Long userId);
}
