package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.PatientTargetRangeDto;
import app.hub_backend.DTO.patient.PatientTargetRangeRequestDto;
import app.hub_backend.service.PatientTargetRangeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/targets")
@RequiredArgsConstructor
public class PatientTargetRangeController {

    private final PatientTargetRangeService targetService;

    @GetMapping
    public ResponseEntity<List<PatientTargetRangeDto>> getTargetRanges(
            @PathVariable("patientId") UUID patientId   // ✅ FIXED
    ) {
        List<PatientTargetRangeDto> targets =
                targetService.getTargetsByPatient(patientId);

        return ResponseEntity.ok(targets);
    }

    @PostMapping
    public ResponseEntity<PatientTargetRangeDto> createOrUpdateTargetRange(
            @PathVariable("patientId") UUID patientId,  // ✅ FIXED
            @Valid @RequestBody PatientTargetRangeRequestDto request
    ) {
        PatientTargetRangeDto updatedTarget =
                targetService.createOrUpdateTarget(patientId, request);

        return ResponseEntity.ok(updatedTarget);
    }
}
