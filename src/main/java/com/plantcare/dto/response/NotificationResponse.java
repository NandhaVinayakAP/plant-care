package com.plantcare.dto.response;

import com.plantcare.enums.NotificationPriority;
import com.plantcare.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Long userId;
    private NotificationType type;
    private String title;
    private String message;
    private NotificationPriority priority;
    private Long plantId;
    private Boolean isRead;
    private LocalDateTime createdDate;
    private LocalDateTime sentDate;
}
