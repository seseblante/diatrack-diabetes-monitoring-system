package app.hub_backend.repositories;

import app.hub_backend.entities.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface MealRepository extends JpaRepository<Meal, UUID> {
    List<Meal> findByPatientIdOrderByLoggedAtDesc(UUID patientId);
    List<Meal> findByPatientIdAndLoggedAtAfterOrderByLoggedAtDesc(UUID patientId, OffsetDateTime since);
}