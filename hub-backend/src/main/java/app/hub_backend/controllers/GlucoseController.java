package app.hub_backend.controllers;

import app.hub_backend.DTO.glucose.GlucoseLogRequestDto;
import app.hub_backend.DTO.logs.GlucoseReadingDto;
import app.hub_backend.service.GlucoseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/glucose")
@RequiredArgsConstructor
public class GlucoseController {

    private final GlucoseService glucoseService;

    @PostMapping
    public ResponseEntity<GlucoseReadingDto> logGlucoseReading(
            @PathVariable("patientId") UUID patientId,
            @Valid @RequestBody GlucoseLogRequestDto request
    ) {
        GlucoseReadingDto dto = glucoseService.logGlucoseReading(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping
    public ResponseEntity<List<GlucoseReadingDto>> getGlucoseReadings(
            @PathVariable("patientId") UUID patientId
    ) {
        List<GlucoseReadingDto> dtos = glucoseService.getGlucoseReadingsForPatient(patientId);
        return ResponseEntity.ok(dtos);
    }
}
