package app.hub_backend.service;

import app.hub_backend.DTO.logs.ActivityLogDto;
import app.hub_backend.DTO.logs.MealDto;
import app.hub_backend.DTO.logs.SymptomNoteDto;
import app.hub_backend.DTO.logs.LogRequestDto;
import java.util.List;
import java.util.UUID;

public interface LogService {
    // Meal Logs
    MealDto createMealLog(UUID patientId, LogRequestDto.MealLog request);
    List<MealDto> getMealLogs(UUID patientId);

    // Symptom Logs
    SymptomNoteDto createSymptomLog(UUID patientId, LogRequestDto.SymptomLog request);
    List<SymptomNoteDto> getSymptomLogs(UUID patientId);

    // Activity Logs
    ActivityLogDto createActivityLog(UUID patientId, LogRequestDto.ActivityLog request);
    List<ActivityLogDto> getActivityLogs(UUID patientId);
}