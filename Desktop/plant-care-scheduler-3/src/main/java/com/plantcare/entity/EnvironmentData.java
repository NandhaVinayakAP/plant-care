package com.plantcare.entity;

import com.plantcare.enums.DataSource;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "environment_data", indexes = {
    @Index(name = "idx_plant_date", columnList = "plant_id, recorded_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnvironmentData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id")
    private Plant plant;

    @Column(name = "location_id", length = 100)
    private String locationId;

    @Column(name = "sensor_id", length = 100)
    private String sensorId;

    @Column(name = "temperature_celsius", precision = 4, scale = 1)
    private BigDecimal temperatureCelsius;

    @Column(name = "humidity_percentage", precision = 4, scale = 1)
    private BigDecimal humidityPercentage;

    @Column(name = "light_level_lux")
    private Integer lightLevelLux;

    @Column(name = "soil_moisture_percentage", precision = 4, scale = 1)
    private BigDecimal soilMoisturePercentage;

    @Column(name = "ph_level", precision = 3, scale = 1)
    private BigDecimal phLevel;

    @CreationTimestamp
    @Column(name = "recorded_date", updatable = false)
    private LocalDateTime recordedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "data_source")
    private DataSource dataSource = DataSource.MANUAL;
}
