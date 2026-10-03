package com.plantcare.service;

import com.plantcare.dto.request.HealthRecordRequest;
import com.plantcare.dto.response.HealthRecordResponse;
import com.plantcare.entity.HealthRecord;
import com.plantcare.entity.Plant;
import com.plantcare.entity.User;
import com.plantcare.enums.UserRole;
import com.plantcare.exception.PlantCareException;
import com.plantcare.exception.PlantNotFoundException;
import com.plantcare.repository.HealthRecordRepository;
import com.plantcare.repository.PlantRepository;
import com.plantcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PlantRepository plantRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public HealthRecordResponse createRecord(HealthRecordRequest request, Long userId) {
        Plant plant = plantRepository.findById(request.getPlantId())
                .orElseThrow(() -> new PlantNotFoundException(request.getPlantId()));
        checkPlantAccess(plant, userId);

        HealthRecord record = new HealthRecord();
        record.setPlant(plant);
        record.setOverallHealth(request.getOverallHealth());
        record.setSymptoms(request.getSymptoms() != null ? String.join(",", request.getSymptoms()) : null);
        record.setDiagnosedIssues(request.getDiagnosedIssues() != null ? String.join(",", request.getDiagnosedIssues()) : null);
        record.setTreatmentsApplied(request.getTreatmentsApplied() != null ? String.join(",", request.getTreatmentsApplied()) : null);
        record.setNotes(request.getNotes());
        record.setFollowUpDate(request.getFollowUpDate());
        record.setRecoveryStatus(request.getRecoveryStatus());

        if (request.getSpecialistId() != null) {
            User specialist = userRepository.findById(request.getSpecialistId())
                    .orElseThrow(() -> new PlantCareException("Specialist not found"));
            record.setSpecialist(specialist);
        }

        if (request.getOverallHealth() != null) {
            plant.setHealthStatus(request.getOverallHealth());
            plantRepository.save(plant);
        }

        return mapToResponse(healthRecordRepository.save(record));
    }

    public List<HealthRecordResponse> getRecordsByPlant(Long plantId, Long userId) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new PlantNotFoundException(plantId));
        checkPlantAccess(plant, userId);

        return healthRecordRepository.findByPlantIdOrderByAssessmentDateDesc(plantId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
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

    private HealthRecordResponse mapToResponse(HealthRecord record) {
        return HealthRecordResponse.builder()
                .id(record.getId())
                .plantId(record.getPlant().getId())
                .plantNickname(record.getPlant().getNickname())
                .assessmentDate(record.getAssessmentDate())
                .overallHealth(record.getOverallHealth())
                .symptoms(record.getSymptoms())
                .diagnosedIssues(record.getDiagnosedIssues())
                .treatmentsApplied(record.getTreatmentsApplied())
                .specialistId(record.getSpecialist() != null ? record.getSpecialist().getId() : null)
                .notes(record.getNotes())
                .followUpDate(record.getFollowUpDate())
                .recoveryStatus(record.getRecoveryStatus())
                .build();
    }
}
