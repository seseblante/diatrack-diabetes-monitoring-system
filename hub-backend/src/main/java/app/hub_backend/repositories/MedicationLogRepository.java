package app.hub_backend.repositories;

import app.hub_backend.entities.MedicationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface MedicationLogRepository extends JpaRepository<MedicationLog, UUID> {

    @Query(
            "SELECT ml " +
                    "FROM MedicationLog ml " +
                    "JOIN ml.regimen mr " +
                    "WHERE mr.patient.id = :patientId " +
                    "ORDER BY ml.takenAt DESC"
    )
    List<MedicationLog> findByPatientId(
            @Param("patientId") UUID patientId
    );

    // New method for the reminder checking service
    @Query(
            "SELECT COUNT(ml) > 0 " +
                    "FROM MedicationLog ml " +
                    "WHERE ml.regimen.id = :regimenId " +
                    "AND ml.takenAt BETWEEN :startTime AND :endTime"
    )
    boolean hasLogForRegimenInTimeWindow(
            @Param("regimenId") UUID regimenId,
            @Param("startTime") OffsetDateTime startTime,
            @Param("endTime") OffsetDateTime endTime
    );

    @Query(
            "SELECT log " +
                    "FROM MedicationLog log " +
                    "JOIN log.regimen reg " +
                    "WHERE reg.patient.id = :patientId " +
                    "AND log.takenAt > :since " +
                    "ORDER BY log.takenAt DESC"
    )
    List<MedicationLog> findLogsByPatientIdSince(
            @Param("patientId") UUID patientId,
            @Param("since") OffsetDateTime since
    );
}
