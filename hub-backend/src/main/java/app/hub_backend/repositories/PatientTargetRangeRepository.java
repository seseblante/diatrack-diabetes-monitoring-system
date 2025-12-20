package app.hub_backend.repositories;

import app.hub_backend.entities.PatientTargetRange;
import app.hub_backend.entities.enums.GlucoseContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PatientTargetRangeRepository extends JpaRepository<PatientTargetRange, UUID> {

    List<PatientTargetRange> findByPatientId(
            @Param("patientId") UUID patientId
    );

    // Used for the upsert logic
    Optional<PatientTargetRange> findByPatientIdAndContext(
            @Param("patientId") UUID patientId,
            @Param("context") GlucoseContext context
    );
}
