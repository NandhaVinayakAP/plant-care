package com.plantcare.dto.request;

import com.plantcare.enums.DataSource;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class EnvironmentDataRequest {
    private Long plantId;
    private String locationId;
    private String sensorId;
    private BigDecimal temperatureCelsius;
    private BigDecimal humidityPercentage;
    private Integer lightLevelLux;
    private BigDecimal soilMoisturePercentage;
    private BigDecimal phLevel;
    private DataSource dataSource;
}
