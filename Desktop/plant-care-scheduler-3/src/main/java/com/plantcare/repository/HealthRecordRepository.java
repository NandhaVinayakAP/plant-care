package com.plantcare.repository;

import com.plantcare.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByPlantIdOrderByAssessmentDateDesc(Long plantId);
}
