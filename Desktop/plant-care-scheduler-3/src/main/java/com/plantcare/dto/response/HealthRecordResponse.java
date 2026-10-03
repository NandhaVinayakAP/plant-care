package com.plantcare.dto.response;

import com.plantcare.enums.HealthStatus;
import com.plantcare.enums.RecoveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordResponse {
    private Long id;
    private Long plantId;
    private String plantNickname;
    private LocalDateTime assessmentDate;
    private HealthStatus overallHealth;
    private String symptoms;
    private String diagnosedIssues;
    private String treatmentsApplied;
    private Long specialistId;
    private String notes;
    private LocalDate followUpDate;
    private RecoveryStatus recoveryStatus;
}
