package app.hub_backend.controllers;

import app.hub_backend.DTO.history.HistoryResponseDto;
import app.hub_backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping
    public ResponseEntity<HistoryResponseDto> getPatientHistory(@PathVariable UUID patientId) {
        HistoryResponseDto history = historyService.getComprehensiveHistory(patientId);
        return ResponseEntity.ok(history);
    }
}