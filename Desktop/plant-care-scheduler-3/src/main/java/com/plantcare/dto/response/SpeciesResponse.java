package com.plantcare.dto.response;

import com.plantcare.enums.CareDifficulty;
import com.plantcare.enums.GrowthRate;
import com.plantcare.enums.LightRequirement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpeciesResponse {
    private Long id;
    private String commonName;
    private String scientificName;
    private String familyName;
    private CareDifficulty careDifficulty;
    private LightRequirement lightRequirements;
    private Integer waterFrequencyDays;
    private Integer humidityMin;
    private Integer humidityMax;
    private BigDecimal temperatureMinCelsius;
    private BigDecimal temperatureMaxCelsius;
    private BigDecimal soilPhMin;
    private BigDecimal soilPhMax;
    private GrowthRate growthRate;
    private Integer maxHeightCm;
    private Integer fertilizerFrequencyDays;
    private Integer pruningFrequencyDays;
    private Integer repottingFrequencyMonths;
    private String commonIssues;
    private String careTips;
    private String imageUrl;
}
