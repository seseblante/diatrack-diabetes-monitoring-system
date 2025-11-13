package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.PatientSettingsDto;
import app.hub_backend.service.PatientService;
import jakarta.validation.Valid; // <-- Make sure this is imported
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final PatientService patientService;

    @GetMapping
    public ResponseEntity<PatientSettingsDto> getPatientSettings(@PathVariable UUID patientId) {
        PatientSettingsDto settings = patientService.getPatientSettings(patientId);
        return ResponseEntity.ok(settings);
    }

    // --- [ADD THIS NEW METHOD] ---
    @PutMapping
    public ResponseEntity<PatientSettingsDto> updatePatientSettings(
            @PathVariable UUID patientId,
            @Valid @RequestBody PatientSettingsDto settingsDto) {

        PatientSettingsDto updatedSettings = patientService.updatePatientSettings(patientId, settingsDto);
        return ResponseEntity.ok(updatedSettings);
    }
}