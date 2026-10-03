package com.plantcare.repository;

import com.plantcare.entity.Species;
import com.plantcare.enums.CareDifficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpeciesRepository extends JpaRepository<Species, Long> {
    Optional<Species> findByScientificName(String scientificName);

    @Query("SELECT s FROM Species s WHERE (:difficulty IS NULL OR s.careDifficulty = :difficulty) " +
           "AND (:search IS NULL OR LOWER(s.commonName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.scientificName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Species> searchSpecies(@Param("difficulty") CareDifficulty difficulty,
                                 @Param("search") String search,
                                 Pageable pageable);

    List<Species> findAllByOrderByIdDesc(Pageable pageable);
}
