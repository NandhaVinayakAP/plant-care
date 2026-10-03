package com.plantcare.dto.response;

import com.plantcare.enums.HealthStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantResponse {
    private Long id;
    private Long ownerId;
    private String ownerUsername;
    private Long speciesId;
    private String speciesCommonName;
    private String speciesScientificName;
    private String nickname;
    private String location;
    private LocalDate acquisitionDate;
    private BigDecimal currentHeightCm;
    private BigDecimal currentWidthCm;
    private String potSize;
    private String soilType;
    private LocalDateTime lastWateredDate;
    private LocalDateTime lastFertilizedDate;
    private LocalDateTime lastPrunedDate;
    private LocalDateTime lastRepottedDate;
    private HealthStatus healthStatus;
    private String notes;
    private Boolean isActive;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
