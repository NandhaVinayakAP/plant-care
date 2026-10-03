package com.plantcare.repository;

import com.plantcare.entity.CareTask;
import com.plantcare.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CareTaskRepository extends JpaRepository<CareTask, Long> {

    @Query("SELECT ct FROM CareTask ct JOIN ct.plant p WHERE p.owner.id = :ownerId " +
           "AND ct.scheduledDate BETWEEN :startDate AND :endDate " +
           "AND ct.status IN :statuses ORDER BY ct.scheduledDate ASC")
    List<CareTask> findUpcomingTasksByOwner(@Param("ownerId") Long ownerId,
                                              @Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate,
                                              @Param("statuses") List<TaskStatus> statuses);

    @Query("SELECT ct FROM CareTask ct JOIN ct.plant p WHERE p.owner.id = :ownerId " +
           "AND ct.scheduledDate < :currentDate AND ct.status = 'PENDING' " +
           "ORDER BY ct.priority DESC, ct.scheduledDate ASC")
    List<CareTask> findOverdueTasksByOwner(@Param("ownerId") Long ownerId,
                                            @Param("currentDate") LocalDateTime currentDate);

    List<CareTask> findByPlantIdOrderByScheduledDateDesc(Long plantId);
    Long countByPlantOwnerIdAndStatus(Long ownerId, TaskStatus status);
}
