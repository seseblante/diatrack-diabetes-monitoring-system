package app.hub_backend.repositories;

import app.hub_backend.entities.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findByPatientIdOrderByStartedAtDesc(UUID patientId);
    List<ActivityLog> findByPatientIdAndStartedAtAfterOrderByStartedAtDesc(UUID patientId, OffsetDateTime since);
}