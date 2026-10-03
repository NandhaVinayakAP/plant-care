package com.plantcare.dto.response;

import com.plantcare.enums.DataSource;
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
public class EnvironmentDataResponse {
    private Long id;
    private Long plantId;
    private String locationId;
    private String sensorId;
    private BigDecimal temperatureCelsius;
    private BigDecimal humidityPercentage;
    private Integer lightLevelLux;
    private BigDecimal soilMoisturePercentage;
    private BigDecimal phLevel;
    private LocalDateTime recordedDate;
    private DataSource dataSource;
}
