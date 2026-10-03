package com.plantcare.repository;

import com.plantcare.entity.CarePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarePlanRepository extends JpaRepository<CarePlan, Long> {
    List<CarePlan> findByPlantIdAndIsActiveTrue(Long plantId);
    List<CarePlan> findBySpecialistIdAndIsActiveTrue(Long specialistId);
}
