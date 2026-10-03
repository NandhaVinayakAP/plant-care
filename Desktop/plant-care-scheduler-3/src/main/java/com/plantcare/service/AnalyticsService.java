package com.plantcare.service;

import com.plantcare.entity.Plant;
import com.plantcare.repository.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private PlantRepository plantRepository;

    public Map<String, Object> getPlantAnalytics(Long plantId) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new RuntimeException("Plant not found"));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("plantId", plant.getId());
        analytics.put("nickname", plant.getNickname());
        analytics.put("healthStatus", plant.getHealthStatus());
        analytics.put("currentHeight", plant.getCurrentHeightCm());
        analytics.put("currentWidth", plant.getCurrentWidthCm());
        analytics.put("lastWatered", plant.getLastWateredDate());
        analytics.put("lastFertilized", plant.getLastFertilizedDate());
        analytics.put("daysOwned", plant.getAcquisitionDate() != null ?
                java.time.temporal.ChronoUnit.DAYS.between(plant.getAcquisitionDate(), java.time.LocalDate.now()) : 0);
        return analytics;
    }

    public Map<String, Object> getCareEffectiveness(Long userId) {
        Map<String, Object> effectiveness = new HashMap<>();
        effectiveness.put("userId", userId);
        effectiveness.put("totalPlants", plantRepository.findByOwnerIdAndIsActiveTrue(userId).size());
        effectiveness.put("analysis", "Care pattern analysis available");
        return effectiveness;
    }

    public Map<String, Object> getSystemAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalPlants", plantRepository.count());
        analytics.put("timestamp", java.time.LocalDateTime.now());
        return analytics;
    }
}
