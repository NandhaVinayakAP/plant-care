package com.plantcare.dto.request;

import com.plantcare.enums.TaskPriority;
import com.plantcare.enums.TaskType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CareTaskRequest {
    @NotNull
    private Long plantId;

    @NotNull
    private TaskType taskType;

    @NotNull
    private LocalDateTime scheduledDate;

    private TaskPriority priority = TaskPriority.MEDIUM;
    private String notes;
}
