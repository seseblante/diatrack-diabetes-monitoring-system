package app.hub_backend.serviceImpl;

import app.hub_backend.entities.*;
import app.hub_backend.entities.enums.FrequencyType; // <-- ADD THIS IMPORT
import app.hub_backend.repositories.*;
import app.hub_backend.service.ReportService;
import app.hub_backend.util.PdfReportGenerator;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate; // <-- ADD THIS IMPORT
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set; // <-- ADD THIS IMPORT
import java.util.UUID;
import java.util.stream.Collectors; // <-- ADD THIS IMPORT

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    // (All your existing repositories)
    private final PdfReportGenerator pdfReportGenerator;
    private final UserRepository userRepository;
    private final GlucoseReadingRepository glucoseReadingRepository;
    private final MedicationRegimenRepository medicationRegimenRepository;
    private final MealRepository mealRepository;
    private final MedicationLogRepository medicationLogRepository;
    // private final ActivityLogRepository activityLogRepository; <-- We removed this
    private final SymptomNoteRepository symptomNoteRepository;
    private final ClinicianNoteRepository clinicianNoteRepository;
    private final PatientClinicianRepository patientClinicianRepository;

    @Override
    @Transactional(readOnly = true)
    public byte[] generatePatientPdfReport(UUID patientId) {
        int days = 30; // We'll use a 30-day window for the report
        OffsetDateTime since = OffsetDateTime.now().minusDays(days);

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found: " + patientId));

        // --- Fetch all data lists ---
        List<GlucoseReading> glucoseReadings = glucoseReadingRepository.findByPatientIdAndMeasuredAtAfterOrderByMeasuredAtDesc(patientId, since);
        List<MedicationRegimen> regimens = medicationRegimenRepository.findByPatientIdAndIsActiveTrueOrderByMedicationName(patientId);
        List<Meal> meals = mealRepository.findByPatientIdAndLoggedAtAfterOrderByLoggedAtDesc(patientId, since);
        List<SymptomNote> symptomNotes = symptomNoteRepository.findByPatientIdAndOccurredAtAfterOrderByOccurredAtDesc(patientId, since);
        List<MedicationLog> medicationLogs = medicationLogRepository.findLogsByPatientIdSince(patientId, since);
        // Activity logs are removed

        List<ClinicianNote> clinicianNotes;
        try {
            PatientClinician link = patientClinicianRepository.findByPatientIdAndStatus(patientId, "ACTIVE")
                    .orElseThrow(() -> new EntityNotFoundException("Active patient-clinician link not found for patient: " + patientId));
            clinicianNotes = clinicianNoteRepository.findByPatientClinicianLinkIdOrderByCreatedAtDesc(link.getId());
        } catch (EntityNotFoundException e) {
            clinicianNotes = Collections.emptyList();
        }

        // --- [NEW] Calculate Compliance ---
        String complianceStatus = calculateMedicationCompliance(patientId, regimens, medicationLogs, days);

        // --- [UPDATED] Pass the new status to the generator ---
        return pdfReportGenerator.generatePatientReport(
                patient,
                glucoseReadings,
                regimens,
                medicationLogs,
                meals,
                // null, // for ActivityLogs
                symptomNotes,
                clinicianNotes,
                complianceStatus // <-- The new argument
        );
    }

    /**
     * New helper method to calculate compliance based on client's rule.
     */
    private String calculateMedicationCompliance(UUID patientId, List<MedicationRegimen> regimens, List<MedicationLog> logs, int days) {
        // 1. Check if the patient has any active DAILY regimens.
        boolean hasDailyMed = regimens.stream()
                .anyMatch(r -> r.getFrequencyType() == FrequencyType.DAILY);

        // 2. If no daily meds, compliance is not applicable.
        if (!hasDailyMed) {
            return "N/A (No daily medications prescribed)";
        }

        // 3. If they HAVE daily meds, check if they missed a day.

        // Get all unique dates the patient *did* log a med
        Set<LocalDate> logDates = logs.stream()
                .map(log -> log.getTakenAt().toLocalDate())
                .collect(Collectors.toSet());

        // 4. Check every day in the window
        LocalDate today = OffsetDateTime.now().toLocalDate();
        for (int i = 0; i < days; i++) {
            LocalDate dayToCheck = today.minusDays(i);

            // If the set of log dates does NOT contain this day, they are non-compliant
            if (!logDates.contains(dayToCheck)) {
                return "Non-Compliant (Missed at least one day)"; // <-- Flagged
            }
        }

        // 5. If the loop finishes, they are compliant
        return "Compliant";
    }
}