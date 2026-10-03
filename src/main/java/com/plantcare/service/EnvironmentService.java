package com.plantcare.service;

import com.plantcare.dto.request.EnvironmentDataRequest;
import com.plantcare.dto.response.EnvironmentDataResponse;
import com.plantcare.entity.EnvironmentData;
import com.plantcare.entity.Plant;
import com.plantcare.entity.User;
import com.plantcare.enums.DataSource;
import com.plantcare.enums.UserRole;
import com.plantcare.exception.PlantCareException;
import com.plantcare.exception.PlantNotFoundException;
import com.plantcare.repository.EnvironmentDataRepository;
import com.plantcare.repository.PlantRepository;
import com.plantcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnvironmentService {

    @Autowired
    private EnvironmentDataRepository environmentDataRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public EnvironmentDataResponse recordData(EnvironmentDataRequest request, Long userId) {
        Plant plant = null;
        if (request.getPlantId() != null) {
            plant = plantRepository.findById(request.getPlantId())
                    .orElseThrow(() -> new PlantNotFoundException(request.getPlantId()));
            checkPlantAccess(plant, userId);
        }

        EnvironmentData data = new EnvironmentData();
        data.setPlant(plant);
        data.setLocationId(request.getLocationId());
        data.setSensorId(request.getSensorId());
        data.setTemperatureCelsius(request.getTemperatureCelsius());
        data.setHumidityPercentage(request.getHumidityPercentage());
        data.setLightLevelLux(request.getLightLevelLux());
        data.setSoilMoisturePercentage(request.getSoilMoisturePercentage());
        data.setPhLevel(request.getPhLevel());
        data.setDataSource(request.getDataSource() != null ? request.getDataSource() : DataSource.MANUAL);

        return mapToResponse(environmentDataRepository.save(data));
    }

    public List<EnvironmentDataResponse> getDataByPlant(Long plantId, Long userId) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new PlantNotFoundException(plantId));
        checkPlantAccess(plant, userId);

        LocalDateTime fromDate = LocalDateTime.now().minusDays(30);
        return environmentDataRepository.findRecentDataByPlant(plantId, fromDate)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public EnvironmentDataResponse getCurrentConditions(Long plantId, Long userId) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new PlantNotFoundException(plantId));
        checkPlantAccess(plant, userId);

        List<EnvironmentData> data = environmentDataRepository.findRecentDataByPlant(
                plantId, LocalDateTime.now().minusHours(24));
        if (data.isEmpty()) {
            return null;
        }
        return mapToResponse(data.get(0));
    }

    private void checkPlantAccess(Plant plant, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new PlantCareException("User not found"));
        if (user.getRole() == UserRole.ADMIN || user.getRole() == UserRole.PLANT_CARE_SPECIALIST) {
            return;
        }
        if (!plant.getOwner().getId().equals(userId)) {
            throw new PlantCareException("Access denied to this plant");
        }
    }

    private EnvironmentDataResponse mapToResponse(EnvironmentData data) {
        return EnvironmentDataResponse.builder()
                .id(data.getId())
                .plantId(data.getPlant() != null ? data.getPlant().getId() : null)
                .locationId(data.getLocationId())
                .sensorId(data.getSensorId())
                .temperatureCelsius(data.getTemperatureCelsius())
                .humidityPercentage(data.getHumidityPercentage())
                .lightLevelLux(data.getLightLevelLux())
                .soilMoisturePercentage(data.getSoilMoisturePercentage())
                .phLevel(data.getPhLevel())
                .recordedDate(data.getRecordedDate())
                .dataSource(data.getDataSource())
                .build();
    }
}
