package app.hub_backend.repositories;

import app.hub_backend.entities.QuickMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface QuickMessageRepository extends JpaRepository<QuickMessage, UUID> {

    List<QuickMessage> findByPatientClinicianLinkIdOrderByCreatedAtDesc(
            @Param("patientClinicianLinkId") UUID patientClinicianLinkId
    );

    List<QuickMessage> findByPatientClinicianLinkIdAndStatus(
            @Param("patientClinicianLinkId") UUID patientClinicianLinkId,
            @Param("status") String status
    );
}
