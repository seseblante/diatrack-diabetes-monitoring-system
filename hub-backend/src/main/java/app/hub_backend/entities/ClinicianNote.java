package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "clinician_notes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClinicianNote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_clinician_link_id", nullable = false)
    private PatientClinician patientClinicianLink;

    @Column
    private String noteContent;

    @Builder.Default
    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}