package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.shared.AlertDto;
import app.hub_backend.entities.Alert;
import app.hub_backend.entities.GlucoseReading;
import app.hub_backend.entities.PatientSettings;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.AlertMapper;
import app.hub_backend.repositories.AlertRepository;
import app.hub_backend.repositories.PatientSettingsRepository;
import app.hub_backend.service.AlertService;
import app.hub_backend.service.AuthService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertServiceImpl implements AlertService {

    private final AlertRepository alertRepository;
    private final PatientSettingsRepository patientSettingsRepository;
    private final AuthService authService;

    @Override
    @Transactional
    public void checkForAlerts(GlucoseReading reading) {
        UUID patientId = reading.getPatient().getId();
        BigDecimal readingValue = reading.getValueMgdl();

        PatientSettings settings = patientSettingsRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient settings not found for alert check: " + patientId));

        if (readingValue.compareTo(settings.getSevereHighMgdl()) >= 0) {
            createAlert(patientId, "SEVERE_HIGH_GLUCOSE", reading);
        }

        if (readingValue.compareTo(settings.getSevereLowMgdl()) <= 0) {
            createAlert(patientId, "SEVERE_LOW_GLUCOSE", reading);
        }
    }

    private void createAlert(UUID patientId, String type, GlucoseReading reading) {
        if (alertRepository.existsByTriggerReadingIdAndStatus(reading.getId(), "OPEN")) {
            return;
        }

        Alert alert = Alert.builder()
                .patientId(patientId)
                .type(type)
                .detectedAt(OffsetDateTime.now())
                .triggerReading(reading)
                .status("OPEN")
                .build();

        alertRepository.save(alert);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AlertDto> getOpenAlertsByPatient(UUID patientId) {
        List<Alert> alerts = alertRepository.findByPatientIdAndStatusOrderByDetectedAtDesc(patientId, "OPEN");
        return alerts.stream()
                .map(AlertMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AlertDto acknowledgeAlert(UUID alertId) {
        User currentUser = authService.currentUser();

        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new EntityNotFoundException("Alert not found: " + alertId));

        alert.setStatus("ACKNOWLEDGED");
        alert.setAcknowledgedBy(currentUser);
        alert.setAcknowledgedAt(OffsetDateTime.now());

        return AlertMapper.toDto(alertRepository.save(alert));
    }

    // --- [THIS IS THE FIX] ---
    @Override
    @Transactional
    public void createMissedMedicationAlert(User patient) {
        Alert alert = Alert.builder()
                // Fixed: .patientId(patient.getId())
                .patientId(patient.getId())
                .type("MISSED_MEDICATION")
                .detectedAt(OffsetDateTime.now())
                .status("OPEN")
                .build();
        alertRepository.save(alert);
    }
}