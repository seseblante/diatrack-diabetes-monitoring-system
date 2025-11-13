package app.hub_backend.entities;

import app.hub_backend.entities.enums.GlucoseContext;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "patient_target_ranges", uniqueConstraints = {
        // Ensures a patient only has one range per context (e.g., only one 'Fasting' range)
        @UniqueConstraint(columnNames = {"patient_id", "context"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientTargetRange {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GlucoseContext context;

    @Column(name = "target_low_mgdl", nullable = false, precision = 6, scale = 2)
    private BigDecimal targetLowMgdl;

    @Column(name = "target_high_mgdl", nullable = false, precision = 6, scale = 2)
    private BigDecimal targetHighMgdl;
}