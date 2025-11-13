package app.hub_backend.entities;

import app.hub_backend.entities.enums.GlucoseContext;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "glucose_readings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GlucoseReading {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Column(nullable = false)
    private OffsetDateTime measuredAt;

    @Column(name = "last_meal_at")
    private OffsetDateTime lastMealAt;

    @Column(name = "value_mgdl", nullable = false, precision = 6, scale = 2)
    private BigDecimal valueMgdl;

    @Enumerated(EnumType.STRING)
    private GlucoseContext context;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}