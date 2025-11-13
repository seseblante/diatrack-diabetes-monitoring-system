package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "clinic_details")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClinicDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinician_id", nullable = false, unique = true)
    private User clinician;

    @Column
    private String clinicName;

    @Column
    private String address;

    @Column
    private String scheduleDays;

    @Column
    private String scheduleHours;

    @Column
    private String contactPerson;

    @Column
    private String contactPhone;

    @Builder.Default
    @Column(nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}