package app.hub_backend.controllers;

import app.hub_backend.DTO.logs.ActivityLogDto;
import app.hub_backend.DTO.logs.MealDto;
import app.hub_backend.DTO.logs.SymptomNoteDto;
import app.hub_backend.DTO.logs.LogRequestDto;
import app.hub_backend.service.LogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}/logs")
@RequiredArgsConstructor
public class LogController {

    private final LogService logService;

    @PostMapping("/meals")
    public ResponseEntity<MealDto> logMeal(
            @PathVariable UUID patientId,
            @Valid @RequestBody LogRequestDto.MealLog request) {
        MealDto meal = logService.createMealLog(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(meal);
    }

    @GetMapping("/meals")
    public ResponseEntity<List<MealDto>> getMealLogs(@PathVariable UUID patientId) {
        List<MealDto> meals = logService.getMealLogs(patientId);
        return ResponseEntity.ok(meals);
    }

    @PostMapping("/symptoms")
    public ResponseEntity<SymptomNoteDto> logSymptom(
            @PathVariable UUID patientId,
            @Valid @RequestBody LogRequestDto.SymptomLog request) {
        SymptomNoteDto symptom = logService.createSymptomLog(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(symptom);
    }

    @GetMapping("/symptoms")
    public ResponseEntity<List<SymptomNoteDto>> getSymptomLogs(@PathVariable UUID patientId) {
        List<SymptomNoteDto> symptoms = logService.getSymptomLogs(patientId);
        return ResponseEntity.ok(symptoms);
    }

    @PostMapping("/activities")
    public ResponseEntity<ActivityLogDto> logActivity(
            @PathVariable UUID patientId,
            @Valid @RequestBody LogRequestDto.ActivityLog request) {
        ActivityLogDto activity = logService.createActivityLog(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(activity);
    }

    @GetMapping("/activities")
    public ResponseEntity<List<ActivityLogDto>> getActivityLogs(@PathVariable UUID patientId) {
        List<ActivityLogDto> activities = logService.getActivityLogs(patientId);
        return ResponseEntity.ok(activities);
    }
}