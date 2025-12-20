package app.hub_backend.repositories;

import app.hub_backend.entities.SymptomNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface SymptomNoteRepository extends JpaRepository<SymptomNote, UUID> {

    List<SymptomNote> findByPatientIdOrderByOccurredAtDesc(
            @Param("patientId") UUID patientId
    );

    List<SymptomNote> findByPatientIdAndOccurredAtAfterOrderByOccurredAtDesc(
            @Param("patientId") UUID patientId,
            @Param("since") OffsetDateTime since
    );
}
