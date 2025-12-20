package app.hub_backend.repositories;

import app.hub_backend.entities.ClinicianNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ClinicianNoteRepository extends JpaRepository<ClinicianNote, UUID> {

    List<ClinicianNote> findByPatientClinicianLinkIdOrderByCreatedAtDesc(
            @Param("patientClinicianLinkId") UUID patientClinicianLinkId
    );
}
