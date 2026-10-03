package com.plantcare.dto.request;

import com.plantcare.enums.HealthStatus;
import com.plantcare.enums.RecoveryStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class HealthRecordRequest {
    @NotNull
    private Long plantId;

    private HealthStatus overallHealth;
    private List<String> symptoms;
    private List<String> diagnosedIssues;
    private List<String> treatmentsApplied;
    private String notes;
    private LocalDate followUpDate;
    private RecoveryStatus recoveryStatus;
    private Long specialistId;
}
