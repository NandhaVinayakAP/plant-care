package com.plantcare.repository;

import com.plantcare.entity.Plant;
import com.plantcare.enums.HealthStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantRepository extends JpaRepository<Plant, Long> {

    @Query("SELECT p FROM Plant p WHERE p.owner.id = :ownerId AND p.isActive = true ORDER BY p.nickname ASC")
    Page<Plant> findActiveByOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT p FROM Plant p JOIN p.species s WHERE p.owner.id = :ownerId " +
           "AND (:nickname IS NULL OR LOWER(p.nickname) LIKE LOWER(CONCAT('%', :nickname, '%'))) " +
           "AND (:speciesName IS NULL OR LOWER(s.commonName) LIKE LOWER(CONCAT('%', :speciesName, '%'))) " +
           "AND (:healthStatus IS NULL OR p.healthStatus = :healthStatus) " +
           "AND (:location IS NULL OR LOWER(p.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND p.isActive = true")
    Page<Plant> findPlantsWithFilters(@Param("ownerId") Long ownerId,
                                       @Param("nickname") String nickname,
                                       @Param("speciesName") String speciesName,
                                       @Param("healthStatus") HealthStatus healthStatus,
                                       @Param("location") String location,
                                       Pageable pageable);

    @Query("SELECT p FROM Plant p WHERE p.owner.id = :ownerId AND p.healthStatus IN ('POOR', 'CRITICAL')")
    List<Plant> findPlantsNeedingAttention(@Param("ownerId") Long ownerId);

    Long countByOwnerIdAndIsActiveTrue(Long ownerId);
    List<Plant> findByOwnerIdAndIsActiveTrue(Long ownerId);
}
