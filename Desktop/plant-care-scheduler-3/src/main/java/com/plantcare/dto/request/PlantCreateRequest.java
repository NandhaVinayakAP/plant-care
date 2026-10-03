package com.plantcare.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PlantCreateRequest {
    @NotNull
    private Long speciesId;

    @NotBlank
    private String nickname;

    private String location;
    private LocalDate acquisitionDate;
    private BigDecimal currentHeightCm;
    private BigDecimal currentWidthCm;
    private String potSize;
    private String soilType;
    private String notes;
}
