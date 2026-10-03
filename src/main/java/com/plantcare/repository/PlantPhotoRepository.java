package com.plantcare.repository;

import com.plantcare.entity.PlantPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantPhotoRepository extends JpaRepository<PlantPhoto, Long> {
    List<PlantPhoto> findByPlantIdOrderByCreatedDateDesc(Long plantId);
}
