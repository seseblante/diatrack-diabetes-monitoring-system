package app.hub_backend.repositories;

import app.hub_backend.entities.ClinicDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ClinicDetailsRepository extends JpaRepository<ClinicDetails, UUID> {

    // This will be our primary way of fetching the details
    Optional<ClinicDetails> findByClinicianId(
            @Param("clinicianId") UUID clinicianId
    );
}
