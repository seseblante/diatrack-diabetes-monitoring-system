package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "clinician_notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClinicianNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinician_id", nullable = false)
    private User clinician;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(nullable = false)
    private OffsetDateTime triggeredAt = OffsetDateTime.now();

    @Column(nullable = false)
    private String status = "SENT";
}