package com.plantcare.dto.request;

import com.plantcare.enums.ConsultationType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ConsultationRequest {
    @NotNull
    private Long specialistId;

    private Long plantId;

    @NotNull
    private ConsultationType consultationType;

    @NotNull
    private LocalDateTime scheduledDate;

    private Integer durationMinutes = 60;
    private String notes;
    private BigDecimal feeAmount;
}
