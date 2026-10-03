package com.plantcare.service;

import com.plantcare.dto.response.SpeciesResponse;
import com.plantcare.entity.Species;
import com.plantcare.enums.CareDifficulty;
import com.plantcare.exception.PlantCareException;
import com.plantcare.repository.SpeciesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpeciesService {

    @Autowired
    private SpeciesRepository speciesRepository;

    public Page<SpeciesResponse> getAllSpecies(int page, int size, CareDifficulty difficulty, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("commonName").ascending());
        return speciesRepository.searchSpecies(difficulty, search, pageable)
                .map(this::mapToResponse);
    }

    public SpeciesResponse getSpeciesById(Long id) {
        Species species = speciesRepository.findById(id)
                .orElseThrow(() -> new PlantCareException("Species not found"));
        return mapToResponse(species);
    }

    public List<SpeciesResponse> getPopularSpecies() {
        return speciesRepository.findAllByOrderByIdDesc(PageRequest.of(0, 10))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private SpeciesResponse mapToResponse(Species species) {
        return SpeciesResponse.builder()
                .id(species.getId())
                .commonName(species.getCommonName())
                .scientificName(species.getScientificName())
                .familyName(species.getFamilyName())
                .careDifficulty(species.getCareDifficulty())
                .lightRequirements(species.getLightRequirements())
                .waterFrequencyDays(species.getWaterFrequencyDays())
                .humidityMin(species.getHumidityMin())
                .humidityMax(species.getHumidityMax())
                .temperatureMinCelsius(species.getTemperatureMinCelsius())
                .temperatureMaxCelsius(species.getTemperatureMaxCelsius())
                .soilPhMin(species.getSoilPhMin())
                .soilPhMax(species.getSoilPhMax())
                .growthRate(species.getGrowthRate())
                .maxHeightCm(species.getMaxHeightCm())
                .fertilizerFrequencyDays(species.getFertilizerFrequencyDays())
                .pruningFrequencyDays(species.getPruningFrequencyDays())
                .repottingFrequencyMonths(species.getRepottingFrequencyMonths())
                .commonIssues(species.getCommonIssues())
                .careTips(species.getCareTips())
                .imageUrl(species.getImageUrl())
                .build();
    }
}
