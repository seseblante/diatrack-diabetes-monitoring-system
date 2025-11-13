package app.hub_backend.repositories;

import app.hub_backend.entities.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface ReminderRepository extends JpaRepository<Reminder, UUID> {

    // New method for the reminder checking service
    @Query("SELECT r FROM Reminder r WHERE r.isActive = true AND r.category = 'MEDICATION' AND r.nextFireAt < :now")
    List<Reminder> findActiveDueMedicationReminders(OffsetDateTime now);
}