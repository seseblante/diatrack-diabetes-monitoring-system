package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "patient_clinicians")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PatientClinician {

    @Column(name = "next_appointment_at")
    private OffsetDateTime nextAppointmentAt;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clinician_id", nullable = false)
    private User clinician;

    @Builder.Default // <-- ADD THIS
    @Column(nullable = false)
    private String status = "ACTIVE";

    @OneToMany(mappedBy = "patientClinicianLink")
    private Set<ClinicianNote> notes;

    @OneToMany(mappedBy = "patientClinicianLink")
    private Set<QuickMessage> messages;

    @Builder.Default // <-- ADD THIS
    @Column(nullable = false)
    private OffsetDateTime linkedAt = OffsetDateTime.now();

    private OffsetDateTime endedAt;
}