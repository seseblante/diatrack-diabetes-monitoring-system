package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.PatientSettingsDto;
import app.hub_backend.service.PatientService;
import jakarta.validation.Valid;
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
    public ResponseEntity<PatientSettingsDto> getPatientSettings(
            @PathVariable("patientId") UUID patientId   // ✅ FIXED
    ) {
        PatientSettingsDto settings = patientService.getPatientSettings(patientId);
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<PatientSettingsDto> updatePatientSettings(
            @PathVariable("patientId") UUID patientId,  // ✅ FIXED
            @Valid @RequestBody PatientSettingsDto settingsDto
    ) {
        PatientSettingsDto updatedSettings =
                patientService.updatePatientSettings(patientId, settingsDto);

        return ResponseEntity.ok(updatedSettings);
    }
}
