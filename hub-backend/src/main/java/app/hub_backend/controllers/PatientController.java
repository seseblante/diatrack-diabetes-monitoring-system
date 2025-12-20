package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.PatientDetailDto;
import app.hub_backend.DTO.patient.PatientUpdateRequest;
import app.hub_backend.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDetailDto> getPatientProfile(
            @PathVariable("patientId") UUID patientId   // ✅ FIXED
    ) {
        PatientDetailDto profile =
                patientService.getPatientProfile(patientId);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<PatientDetailDto> updatePatientProfile(
            @PathVariable("patientId") UUID patientId,  // ✅ FIXED
            @Valid @RequestBody PatientUpdateRequest updateRequest
    ) {
        PatientDetailDto updatedProfile =
                patientService.updatePatientProfile(patientId, updateRequest);

        return ResponseEntity.ok(updatedProfile);
    }
}
