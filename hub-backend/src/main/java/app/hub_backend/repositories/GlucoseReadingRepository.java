package app.hub_backend.repositories;

import app.hub_backend.entities.GlucoseReading;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface GlucoseReadingRepository extends JpaRepository<GlucoseReading, UUID> {
    List<GlucoseReading> findByPatientIdOrderByMeasuredAtDesc(UUID patientId);
    List<GlucoseReading> findByPatientIdAndMeasuredAtAfterOrderByMeasuredAtDesc(UUID patientId, OffsetDateTime since);
}