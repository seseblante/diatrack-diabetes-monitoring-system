package app.hub_backend.repositories;

import app.hub_backend.entities.ClinicianNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ClinicianNotificationRepository extends JpaRepository<ClinicianNotification, UUID> {
    List<ClinicianNotification> findByPatientIdOrderByTriggeredAtDesc(UUID patientId);
}