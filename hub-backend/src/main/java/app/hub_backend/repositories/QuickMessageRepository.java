package app.hub_backend.repositories;

import app.hub_backend.entities.QuickMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuickMessageRepository extends JpaRepository<QuickMessage, UUID> {

    List<QuickMessage> findByPatientClinicianLinkIdOrderByCreatedAtDesc(UUID patientClinicianLinkId);

    List<QuickMessage> findByPatientClinicianLinkIdAndStatus(UUID patientClinicianLinkId, String status);
}