package com.plantcare.service;

import com.plantcare.dto.request.ConsultationRequest;
import com.plantcare.dto.response.ConsultationResponse;
import com.plantcare.dto.response.UserResponse;
import com.plantcare.entity.Consultation;
import com.plantcare.entity.Plant;
import com.plantcare.entity.User;
import com.plantcare.enums.ConsultationStatus;
import com.plantcare.enums.UserRole;
import com.plantcare.exception.PlantCareException;
import com.plantcare.exception.PlantNotFoundException;
import com.plantcare.repository.ConsultationRepository;
import com.plantcare.repository.PlantRepository;
import com.plantcare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecialistService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PlantRepository plantRepository;

    public List<UserResponse> getAllSpecialists() {
        return userRepository.findByRole(UserRole.PLANT_CARE_SPECIALIST)
                .stream().map(this::mapToUserResponse).collect(Collectors.toList());
    }

    public UserResponse getSpecialistById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new PlantCareException("Specialist not found"));
        if (user.getRole() != UserRole.PLANT_CARE_SPECIALIST && user.getRole() != UserRole.ADMIN) {
            throw new PlantCareException("User is not a specialist");
        }
        return mapToUserResponse(user);
    }

    @Transactional
    public ConsultationResponse bookConsultation(ConsultationRequest request, Long clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new PlantCareException("Client not found"));
        User specialist = userRepository.findById(request.getSpecialistId())
                .orElseThrow(() -> new PlantCareException("Specialist not found"));

        if (specialist.getRole() != UserRole.PLANT_CARE_SPECIALIST) {
            throw new PlantCareException("Selected user is not a specialist");
        }

        Plant plant = null;
        if (request.getPlantId() != null) {
            plant = plantRepository.findById(request.getPlantId())
                    .orElseThrow(() -> new PlantNotFoundException(request.getPlantId()));
            if (!plant.getOwner().getId().equals(clientId)) {
                throw new PlantCareException("You can only book consultations for your own plants");
            }
        }

        Consultation consultation = new Consultation();
        consultation.setClient(client);
        consultation.setSpecialist(specialist);
        consultation.setPlant(plant);
        consultation.setConsultationType(request.getConsultationType());
        consultation.setScheduledDate(request.getScheduledDate());
        consultation.setDurationMinutes(request.getDurationMinutes());
        consultation.setStatus(ConsultationStatus.SCHEDULED);
        consultation.setFeeAmount(request.getFeeAmount());

        return mapConsultationToResponse(consultationRepository.save(consultation));
    }

    public List<ConsultationResponse> getMyConsultations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new PlantCareException("User not found"));

        List<Consultation> consultations;
        if (user.getRole() == UserRole.PLANT_CARE_SPECIALIST || user.getRole() == UserRole.ADMIN) {
            consultations = consultationRepository.findBySpecialistId(userId);
        } else {
            consultations = consultationRepository.findByClientId(userId);
        }
        return consultations.stream().map(this::mapConsultationToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ConsultationResponse completeConsultation(Long consultationId, String notes, Integer rating, Long userId) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new PlantCareException("Consultation not found"));

        User user = userRepository.findById(userId).orElseThrow();
        if (!consultation.getSpecialist().getId().equals(userId) && user.getRole() != UserRole.ADMIN) {
            throw new PlantCareException("Only the specialist can complete this consultation");
        }

        consultation.setStatus(ConsultationStatus.COMPLETED);
        consultation.setConsultationNotes(notes);
        consultation.setRating(rating);

        return mapConsultationToResponse(consultationRepository.save(consultation));
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .location(user.getLocation())
                .bio(user.getBio())
                .expertise(user.getExpertise())
                .createdDate(user.getCreatedDate())
                .build();
    }

    private ConsultationResponse mapConsultationToResponse(Consultation c) {
        return ConsultationResponse.builder()
                .id(c.getId())
                .clientId(c.getClient().getId())
                .clientName(c.getClient().getFullName() != null ? c.getClient().getFullName() : c.getClient().getUsername())
                .specialistId(c.getSpecialist().getId())
                .specialistName(c.getSpecialist().getFullName() != null ? c.getSpecialist().getFullName() : c.getSpecialist().getUsername())
                .plantId(c.getPlant() != null ? c.getPlant().getId() : null)
                .plantNickname(c.getPlant() != null ? c.getPlant().getNickname() : null)
                .consultationType(c.getConsultationType())
                .scheduledDate(c.getScheduledDate())
                .durationMinutes(c.getDurationMinutes())
                .status(c.getStatus())
                .consultationNotes(c.getConsultationNotes())
                .rating(c.getRating())
                .feeAmount(c.getFeeAmount())
                .build();
    }
}
