package app.hub_backend.DTO.history;

import app.hub_backend.DTO.logs.ActivityLogDto;
import app.hub_backend.DTO.logs.GlucoseReadingDto;
import app.hub_backend.DTO.logs.MealDto;
import app.hub_backend.DTO.logs.SymptomNoteDto;
import app.hub_backend.DTO.medication.MedicationLogDto;

import java.util.List;

public record HistoryResponseDto(
        List<GlucoseReadingDto> glucoseReadings,
        List<MedicationLogDto> medicationLogs,
        List<MealDto> meals,
        List<SymptomNoteDto> symptoms,
        List<ActivityLogDto> activities
) {}