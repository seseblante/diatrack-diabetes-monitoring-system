package app.hub_backend.repositories;

import app.hub_backend.entities.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface AlertRepository extends JpaRepository<Alert, UUID> {

    List<Alert> findByPatientIdAndStatusOrderByDetectedAtDesc(
            @Param("patientId") UUID patientId,
            @Param("status") String status
    );

    boolean existsByTriggerReadingIdAndStatus(
            @Param("triggerReadingId") UUID triggerReadingId,
            @Param("status") String status
    );
}
