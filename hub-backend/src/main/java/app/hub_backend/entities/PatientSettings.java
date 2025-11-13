package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "patient_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientSettings {

    @Id
    private UUID patientId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "patient_id")
    private User patient;

    @Column(nullable = false, precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal severeLowMgdl = new BigDecimal("54.00");

    @Column(nullable = false, precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal severeHighMgdl = new BigDecimal("250.00"); // (I changed this from 300 to match our earlier discussion)

    @Column(nullable = false)
    @Builder.Default
    private Integer trendWindowDays = 7; // (I changed this from 3 to 7)

    @Column(nullable = false)
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}