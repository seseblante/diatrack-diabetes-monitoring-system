package app.hub_backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "quick_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QuickMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_clinician_link_id", nullable = false)
    private PatientClinician patientClinicianLink;

    @Column(nullable = false)
    private String messageContent;

    @Builder.Default
    @Column(nullable = false)
    private String status = "SENT"; // SENT, READ

    @Builder.Default
    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column
    private OffsetDateTime readAt;
}