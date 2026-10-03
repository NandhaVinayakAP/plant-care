package com.plantcare.dto.response;

import com.plantcare.enums.ConsultationStatus;
import com.plantcare.enums.ConsultationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private Long specialistId;
    private String specialistName;
    private Long plantId;
    private String plantNickname;
    private ConsultationType consultationType;
    private LocalDateTime scheduledDate;
    private Integer durationMinutes;
    private ConsultationStatus status;
    private String consultationNotes;
    private Integer rating;
    private BigDecimal feeAmount;
}
