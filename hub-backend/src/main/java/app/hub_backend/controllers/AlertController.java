package app.hub_backend.controllers;

import app.hub_backend.DTO.shared.AlertDto;
import app.hub_backend.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AlertDto>> getAlertsForPatient(@PathVariable UUID patientId) {
        List<AlertDto> alerts = alertService.getOpenAlertsByPatient(patientId);
        return ResponseEntity.ok(alerts);
    }

    @PostMapping("/{alertId}/acknowledge")
    public ResponseEntity<AlertDto> acknowledgeAlert(@PathVariable UUID alertId) {
        AlertDto updatedAlert = alertService.acknowledgeAlert(alertId);
        return ResponseEntity.ok(updatedAlert);
    }
}