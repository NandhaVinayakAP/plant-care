package com.plantcare.repository;

import com.plantcare.entity.EnvironmentData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EnvironmentDataRepository extends JpaRepository<EnvironmentData, Long> {

    @Query("SELECT ed FROM EnvironmentData ed WHERE ed.plant.id = :plantId " +
           "AND ed.recordedDate >= :fromDate ORDER BY ed.recordedDate DESC")
    List<EnvironmentData> findRecentDataByPlant(@Param("plantId") Long plantId,
                                                 @Param("fromDate") LocalDateTime fromDate);
}
