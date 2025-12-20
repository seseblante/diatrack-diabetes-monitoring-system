package app.hub_backend.repositories;

import app.hub_backend.entities.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface MealRepository extends JpaRepository<Meal, UUID> {

    List<Meal> findByPatientIdOrderByLoggedAtDesc(
            @Param("patientId") UUID patientId
    );

    List<Meal> findByPatientIdAndLoggedAtAfterOrderByLoggedAtDesc(
            @Param("patientId") UUID patientId,
            @Param("since") OffsetDateTime since
    );
}
