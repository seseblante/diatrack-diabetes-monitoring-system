package app.hub_backend.serviceImpl;

import app.hub_backend.entities.Reminder;
import app.hub_backend.repositories.MedicationLogRepository;
import app.hub_backend.repositories.MedicationRegimenRepository;
import app.hub_backend.repositories.ReminderRepository;
import app.hub_backend.service.AlertService;
import app.hub_backend.service.ReminderCheckService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderCheckServiceImpl implements ReminderCheckService {

    private final ReminderRepository reminderRepository;
    private final MedicationLogRepository medicationLogRepository;
    private final MedicationRegimenRepository medicationRegimenRepository;
    private final AlertService alertService;
    private static final long CHECK_BUFFER_MINUTES = 15;

    @Override
    @Scheduled(fixedRate = 300000) // Runs every 5 minutes
    @Transactional
    public void checkForMissedMedicationReminders() {
        log.info("Checking for missed medication reminders...");
        OffsetDateTime checkTime = OffsetDateTime.now().minusMinutes(CHECK_BUFFER_MINUTES);

        List<Reminder> dueReminders = reminderRepository.findActiveDueMedicationReminders(checkTime);

        for (Reminder reminder : dueReminders) {
            OffsetDateTime startTime = reminder.getNextFireAt().minusMinutes(CHECK_BUFFER_MINUTES);
            OffsetDateTime endTime = reminder.getNextFireAt().plusMinutes(CHECK_BUFFER_MINUTES);

            medicationRegimenRepository.findFirstByPatientIdAndMedicationName(reminder.getUser().getId(), reminder.getTitle())
                    .ifPresentOrElse(
                            regimen -> {
                                boolean wasTaken = medicationLogRepository.hasLogForRegimenInTimeWindow(
                                        regimen.getId(), startTime, endTime
                                );

                                if (!wasTaken) {
                                    log.warn("Missed dose detected for user {} and reminder {}", reminder.getUser().getId(), reminder.getId());
                                    alertService.createMissedMedicationAlert(reminder.getUser());
                                }
                            },
                            () -> log.error("Could not find matching medication regimen for reminder title: {}", reminder.getTitle())
                    );

            // Deactivate the reminder to prevent re-triggering for this specific instance.
            // A more complex system would calculate the next fire time for daily reminders.
            reminder.setActive(false);
            reminderRepository.save(reminder);
        }
    }
}