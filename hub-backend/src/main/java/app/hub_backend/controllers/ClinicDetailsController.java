package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.ClinicDetailsDto;
import app.hub_backend.DTO.patient.ClinicDetailsRequestDto;
import app.hub_backend.service.ClinicDetailsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/clinics")
@RequiredArgsConstructor
public class ClinicDetailsController {

    private final ClinicDetailsService clinicDetailsService;

    @GetMapping("/clinician/{clinicianId}")
    public ResponseEntity<ClinicDetailsDto> getClinicianDetails(@PathVariable("clinicianId") UUID clinicianId) {
        ClinicDetailsDto details = clinicDetailsService.getClinicDetails(clinicianId);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/my-details")
    public ResponseEntity<ClinicDetailsDto> getMyDetails() {
        // Assumes auth service can identify the current user
        ClinicDetailsDto details = clinicDetailsService.getMyClinicDetails();
        return ResponseEntity.ok(details);
    }

    @PutMapping("/my-details")
    public ResponseEntity<ClinicDetailsDto> updateMyDetails(@Valid @RequestBody ClinicDetailsRequestDto request) {
        ClinicDetailsDto updatedDetails = clinicDetailsService.updateMyClinicDetails(request);
        return ResponseEntity.ok(updatedDetails);
    }
}