package app.hub_backend.repositories;

import app.hub_backend.entities.PatientClinician;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; // ADD THIS IMPORT
import java.util.Optional;
import java.util.UUID;

public interface PatientClinicianRepository extends JpaRepository<PatientClinician, UUID> {

    // NEW METHODS
    List<PatientClinician> findByPatientId(UUID patientId);
    List<PatientClinician> findByClinicianId(UUID clinicianId);
    Optional<PatientClinician> findByPatientIdAndStatus(UUID patientId, String status);
}