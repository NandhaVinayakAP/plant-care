package com.plantcare.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummary {
    private Long totalPlants;
    private Long plantsNeedingAttention;
    private Long upcomingTasks;
    private Long overdueTasks;
    private Long completedTasksThisWeek;
    private Map<String, Long> plantsByHealthStatus;
    private List<CareTaskResponse> upcomingTasksList;
    private List<PlantResponse> plantsNeedingAttentionList;
}
