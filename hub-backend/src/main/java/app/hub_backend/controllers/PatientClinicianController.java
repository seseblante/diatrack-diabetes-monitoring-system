package app.hub_backend.controllers;

import app.hub_backend.DTO.LinkRequestDto;
import app.hub_backend.DTO.PatientClinicianDto;
import app.hub_backend.service.PatientClinicianService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; // ADD THIS IMPORT
import java.util.UUID;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class PatientClinicianController {

    private final PatientClinicianService patientClinicianService;

    @PostMapping("/patient-clinician")
    public ResponseEntity<PatientClinicianDto> createLink(@Valid @RequestBody LinkRequestDto request) {
        PatientClinicianDto linkDto = patientClinicianService.createLink(request.patientId(), request.clinicianId());
        return ResponseEntity.status(HttpStatus.CREATED).body(linkDto);
    }

    // NEW ENDPOINT to get clinicians for a specific patient
    @GetMapping("/patients/{patientId}")
    public ResponseEntity<List<PatientClinicianDto>> getCliniciansForPatient(@PathVariable UUID patientId) {
        List<PatientClinicianDto> links = patientClinicianService.getCliniciansForPatient(patientId);
        return ResponseEntity.ok(links);
    }

    // NEW ENDPOINT to get patients for a specific clinician
    @GetMapping("/clinicians/{clinicianId}")
    public ResponseEntity<List<PatientClinicianDto>> getPatientsForClinician(@PathVariable UUID clinicianId) {
        List<PatientClinicianDto> links = patientClinicianService.getPatientsForClinician(clinicianId);
        return ResponseEntity.ok(links);
    }
}