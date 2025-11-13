package app.hub_backend.repositories;

import app.hub_backend.entities.MedicationRegimen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MedicationRegimenRepository extends JpaRepository<MedicationRegimen, UUID> {

    List<MedicationRegimen> findByPatientIdAndIsActiveTrueOrderByMedicationName(UUID patientId);

    List<MedicationRegimen> findByPatientIdOrderByMedicationName(UUID patientId);

    // New method for the reminder checking service
    Optional<MedicationRegimen> findFirstByPatientIdAndMedicationName(UUID patientId, String medicationName);
}