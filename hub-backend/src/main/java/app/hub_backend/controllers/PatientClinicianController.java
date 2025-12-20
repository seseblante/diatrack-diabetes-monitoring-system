package app.hub_backend.controllers;

import app.hub_backend.DTO.LinkRequestDto;
import app.hub_backend.DTO.PatientClinicianDto;
import app.hub_backend.service.PatientClinicianService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class PatientClinicianController {

    private final PatientClinicianService patientClinicianService;

    @PostMapping("/patient-clinician")
    public ResponseEntity<PatientClinicianDto> createLink(
            @Valid @RequestBody LinkRequestDto request
    ) {
        PatientClinicianDto linkDto =
                patientClinicianService.createLink(
                        request.patientId(),
                        request.clinicianId()
                );

        return ResponseEntity.status(HttpStatus.CREATED).body(linkDto);
    }

    // Get clinicians for a specific patient
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<PatientClinicianDto>> getCliniciansForPatient(
            @PathVariable("patientId") UUID patientId   // ✅ FIXED
    ) {
        List<PatientClinicianDto> links =
                patientClinicianService.getCliniciansForPatient(patientId);

        return ResponseEntity.ok(links);
    }

    // Get patients for a specific clinician
    @GetMapping("/clinicians/{clinicianId}")
    public ResponseEntity<List<PatientClinicianDto>> getPatientsForClinician(
            @PathVariable("clinicianId") UUID clinicianId   // ✅ FIXED
    ) {
        List<PatientClinicianDto> links =
                patientClinicianService.getPatientsForClinician(clinicianId);

        return ResponseEntity.ok(links);
    }
}
