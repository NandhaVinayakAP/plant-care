package com.plantcare.entity;

import com.plantcare.enums.CareDifficulty;
import com.plantcare.enums.GrowthRate;
import com.plantcare.enums.LightRequirement;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "species")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Species {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "common_name", nullable = false, length = 200)
    private String commonName;

    @Column(name = "scientific_name", unique = true, nullable = false, length = 200)
    private String scientificName;

    @Column(name = "family_name", length = 100)
    private String familyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "care_difficulty")
    private CareDifficulty careDifficulty;

    @Enumerated(EnumType.STRING)
    @Column(name = "light_requirements")
    private LightRequirement lightRequirements;

    @Column(name = "water_frequency_days")
    private Integer waterFrequencyDays;

    @Column(name = "humidity_min")
    private Integer humidityMin;

    @Column(name = "humidity_max")
    private Integer humidityMax;

    @Column(name = "temperature_min_celsius", precision = 5, scale = 2)
    private BigDecimal temperatureMinCelsius;

    @Column(name = "temperature_max_celsius", precision = 5, scale = 2)
    private BigDecimal temperatureMaxCelsius;

    @Column(name = "soil_ph_min", precision = 3, scale = 1)
    private BigDecimal soilPhMin;

    @Column(name = "soil_ph_max", precision = 3, scale = 1)
    private BigDecimal soilPhMax;

    @Enumerated(EnumType.STRING)
    @Column(name = "growth_rate")
    private GrowthRate growthRate;

    @Column(name = "max_height_cm")
    private Integer maxHeightCm;

    @Column(name = "fertilizer_frequency_days")
    private Integer fertilizerFrequencyDays;

    @Column(name = "pruning_frequency_days")
    private Integer pruningFrequencyDays;

    @Column(name = "repotting_frequency_months")
    private Integer repottingFrequencyMonths;

    @Column(name = "common_issues", columnDefinition = "TEXT")
    private String commonIssues;

    @Column(name = "care_tips", columnDefinition = "TEXT")
    private String careTips;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;
}
