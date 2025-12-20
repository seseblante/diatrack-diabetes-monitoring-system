package app.hub_backend.repositories;

import app.hub_backend.entities.PatientClinician;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PatientClinicianRepository extends JpaRepository<PatientClinician, UUID> {

    List<PatientClinician> findByPatientId(
            @Param("patientId") UUID patientId
    );

    List<PatientClinician> findByClinicianId(
            @Param("clinicianId") UUID clinicianId
    );

    Optional<PatientClinician> findByPatientIdAndStatus(
            @Param("patientId") UUID patientId,
            @Param("status") String status
    );
}
