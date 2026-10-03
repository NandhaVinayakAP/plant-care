package com.plantcare.dto.request;

import com.plantcare.enums.HealthStatus;
import lombok.Data;

@Data
public class PlantSearchRequest {
    private String nickname;
    private String speciesName;
    private String location;
    private HealthStatus healthStatus;
}
