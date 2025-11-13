package app.hub_backend.service;

import app.hub_backend.DTO.shared.AlertDto;
import app.hub_backend.entities.GlucoseReading;
import app.hub_backend.entities.User;

import java.util.List;
import java.util.UUID;

public interface AlertService {
    List<AlertDto> getOpenAlertsByPatient(UUID patientId);
    AlertDto acknowledgeAlert(UUID alertId);
    void createMissedMedicationAlert(User patient);
    void checkForAlerts(GlucoseReading reading);
}