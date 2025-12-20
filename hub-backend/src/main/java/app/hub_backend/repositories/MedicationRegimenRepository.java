package app.hub_backend.repositories;

import app.hub_backend.entities.MedicationRegimen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MedicationRegimenRepository extends JpaRepository<MedicationRegimen, UUID> {

    List<MedicationRegimen> findByPatientIdAndIsActiveTrueOrderByMedicationName(
            @Param("patientId") UUID patientId
    );

    List<MedicationRegimen> findByPatientIdOrderByMedicationName(
            @Param("patientId") UUID patientId
    );

    // New method for the reminder checking service
    Optional<MedicationRegimen> findFirstByPatientIdAndMedicationName(
            @Param("patientId") UUID patientId,
            @Param("medicationName") String medicationName
    );
}
