package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.history.HistoryResponseDto;
import app.hub_backend.mapper.*;
import app.hub_backend.repositories.*;
import app.hub_backend.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final GlucoseReadingRepository glucoseReadingRepository;
    private final MedicationLogRepository medicationLogRepository;
    private final MealRepository mealRepository;
    private final SymptomNoteRepository symptomNoteRepository;
    private final ActivityLogRepository activityLogRepository;

    @Override
    public HistoryResponseDto getComprehensiveHistory(UUID patientId) {
        // Add authorization logic here
        var glucose = glucoseReadingRepository.findByPatientIdOrderByMeasuredAtDesc(patientId).stream().map(GlucoseReadingMapper::toDto).collect(Collectors.toList());
        var meds = medicationLogRepository.findByPatientId(patientId).stream().map(MedicationMapper::toDto).collect(Collectors.toList());
        var meals = mealRepository.findByPatientIdOrderByLoggedAtDesc(patientId).stream().map(MealMapper::toDto).collect(Collectors.toList());
        var symptoms = symptomNoteRepository.findByPatientIdOrderByOccurredAtDesc(patientId).stream().map(SymptomNoteMapper::toDto).collect(Collectors.toList());
        var activities = activityLogRepository.findByPatientIdOrderByStartedAtDesc(patientId).stream().map(ActivityLogMapper::toDto).collect(Collectors.toList());

        return new HistoryResponseDto(glucose, meds, meals, symptoms, activities);
    }
}