package app.hub_backend.repositories;

import app.hub_backend.entities.PatientSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientSettingsRepository extends JpaRepository<PatientSettings, UUID> {
}