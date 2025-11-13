package app.hub_backend.repositories;

import app.hub_backend.entities.SymptomNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface SymptomNoteRepository extends JpaRepository<SymptomNote, UUID> {
    List<SymptomNote> findByPatientIdOrderByOccurredAtDesc(UUID patientId);
    List<SymptomNote> findByPatientIdAndOccurredAtAfterOrderByOccurredAtDesc(UUID patientId, OffsetDateTime since);
}