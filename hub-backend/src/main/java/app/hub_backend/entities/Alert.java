package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "alerts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // We use a direct UUID to avoid a heavy join
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(nullable = false)
    private String type; // e.g., "SEVERE_HIGH_GLUCOSE"

    @Column(nullable = false)
    private OffsetDateTime detectedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trigger_reading_id")
    private GlucoseReading triggerReading;

    @Column(nullable = false)
    private String status; // "OPEN", "ACKNOWLEDGED"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acknowledged_by")
    private User acknowledgedBy;

    private OffsetDateTime acknowledgedAt;

    private String notes;
}