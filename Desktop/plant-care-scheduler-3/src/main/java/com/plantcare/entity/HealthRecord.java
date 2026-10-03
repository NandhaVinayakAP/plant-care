package com.plantcare.entity;

import com.plantcare.enums.HealthStatus;
import com.plantcare.enums.RecoveryStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    @CreationTimestamp
    @Column(name = "assessment_date", updatable = false)
    private LocalDateTime assessmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "overall_health")
    private HealthStatus overallHealth;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(name = "diagnosed_issues", columnDefinition = "TEXT")
    private String diagnosedIssues;

    @Column(name = "treatments_applied", columnDefinition = "TEXT")
    private String treatmentsApplied;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialist_id")
    private User specialist;

    @Column(columnDefinition = "TEXT")
    private String photos;

    @Column(name = "growth_measurements", columnDefinition = "TEXT")
    private String growthMeasurements;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "recovery_status")
    private RecoveryStatus recoveryStatus = RecoveryStatus.NOT_APPLICABLE;
}
