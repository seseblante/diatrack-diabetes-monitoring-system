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
    private BigDecimal severeLowMgdl = new BigDecimal("54.00");

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal severeHighMgdl = new BigDecimal("300.00");

    @Column(nullable = false)
    private Integer trendWindowDays = 3;

    @Column(nullable = false)
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}