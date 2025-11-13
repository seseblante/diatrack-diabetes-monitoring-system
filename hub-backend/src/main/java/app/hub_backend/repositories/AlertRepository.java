package app.hub_backend.repositories;

import app.hub_backend.entities.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AlertRepository extends JpaRepository<Alert, UUID> {

    List<Alert> findByPatientIdAndStatusOrderByDetectedAtDesc(UUID patientId, String status);

    boolean existsByTriggerReadingIdAndStatus(UUID triggerReadingId, String status);
}