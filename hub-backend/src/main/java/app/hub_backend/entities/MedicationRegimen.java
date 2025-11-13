package app.hub_backend.entities;

import app.hub_backend.entities.enums.FrequencyType;
import app.hub_backend.util.hibernate.LocalTimeListType;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "medication_regimens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicationRegimen {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(nullable = false)
    private String medicationName;

    @Column(precision = 10, scale = 3)
    private BigDecimal doseAmount;

    private String doseUnit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FrequencyType frequencyType;

    @Column(name = "frequency_value", nullable = false)
    private int frequencyValue;

    @Type(JsonType.class)
    @Column(name = "times_of_day", columnDefinition = "jsonb")
    private List<LocalTime> timesOfDay;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}