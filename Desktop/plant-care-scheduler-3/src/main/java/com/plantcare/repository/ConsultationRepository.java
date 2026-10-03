package com.plantcare.repository;

import com.plantcare.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    @Query("SELECT c FROM Consultation c WHERE c.client.id = :userId ORDER BY c.scheduledDate DESC")
    List<Consultation> findByClientId(@Param("userId") Long userId);

    @Query("SELECT c FROM Consultation c WHERE c.specialist.id = :userId ORDER BY c.scheduledDate DESC")
    List<Consultation> findBySpecialistId(@Param("userId") Long userId);
}
