package app.hub_backend.controllers;

import app.hub_backend.DTO.medication.MedicationLogDto;
import app.hub_backend.DTO.medication.MedicationRegimenDto;
import app.hub_backend.DTO.medication.MedicationRegimenRequest;
import app.hub_backend.DTO.medication.MedicationRequestDto;
import app.hub_backend.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/medications")
@RequiredArgsConstructor
public class MedicationController {

    private final MedicationService medicationService;

    // ---------------- REGIMENS ----------------

    @PostMapping("/regimens")
    public ResponseEntity<MedicationRegimenDto> addMedicationRegimen(
            @PathVariable("patientId") UUID patientId,
            @Valid @RequestBody MedicationRegimenRequest request
    ) {
        MedicationRegimenDto regimen =
                medicationService.createMedicationRegimen(patientId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(regimen);
    }

    @GetMapping("/regimens")
    public ResponseEntity<List<MedicationRegimenDto>> getActiveMedicationRegimens(
            @PathVariable("patientId") UUID patientId
    ) {
        List<MedicationRegimenDto> regimens =
                medicationService.getActiveRegimens(patientId);

        return ResponseEntity.ok(regimens);
    }

    @PutMapping("/regimens/{regimenId}")
    public ResponseEntity<MedicationRegimenDto> updateMedicationRegimen(
            @PathVariable("patientId") UUID patientId,   // ✅ REQUIRED
            @PathVariable("regimenId") UUID regimenId,
            @Valid @RequestBody MedicationRegimenRequest request
    ) {
        MedicationRegimenDto regimen =
                medicationService.updateMedicationRegimen(regimenId, request);

        return ResponseEntity.ok(regimen);
    }

    // ---------------- LOGS ----------------

    @PostMapping("/logs")
    public ResponseEntity<MedicationLogDto> logMedicationTaken(
            @PathVariable("patientId") UUID patientId,   // optional, but consistent
            @Valid @RequestBody MedicationRequestDto.LogTaken request
    ) {
        MedicationLogDto log =
                medicationService.createMedicationLog(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(log);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<MedicationLogDto>> getMedicationLogs(
            @PathVariable("patientId") UUID patientId
    ) {
        List<MedicationLogDto> logs =
                medicationService.getMedicationLogs(patientId);

        return ResponseEntity.ok(logs);
    }

    @DeleteMapping("/logs/{logId}")
    public ResponseEntity<Void> deleteMedicationLog(
            @PathVariable("patientId") UUID patientId,
            @PathVariable("logId") UUID logId
    ) {
        medicationService.deleteMedicationLog(logId);
        return ResponseEntity.noContent().build();
    }
}
