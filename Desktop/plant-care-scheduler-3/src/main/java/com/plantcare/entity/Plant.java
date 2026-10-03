package com.plantcare.entity;

import com.plantcare.enums.HealthStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "plants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "species_id", nullable = false)
    private Species species;

    @Column(nullable = false, length = 100)
    private String nickname;

    @Column(length = 200)
    private String location;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @Column(name = "current_height_cm", precision = 5, scale = 1)
    private BigDecimal currentHeightCm;

    @Column(name = "current_width_cm", precision = 5, scale = 1)
    private BigDecimal currentWidthCm;

    @Column(name = "pot_size", length = 50)
    private String potSize;

    @Column(name = "soil_type", length = 100)
    private String soilType;

    @Column(name = "last_watered_date")
    private LocalDateTime lastWateredDate;

    @Column(name = "last_fertilized_date")
    private LocalDateTime lastFertilizedDate;

    @Column(name = "last_pruned_date")
    private LocalDateTime lastPrunedDate;

    @Column(name = "last_repotted_date")
    private LocalDateTime lastRepottedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "health_status")
    private HealthStatus healthStatus = HealthStatus.GOOD;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @UpdateTimestamp
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;
}
