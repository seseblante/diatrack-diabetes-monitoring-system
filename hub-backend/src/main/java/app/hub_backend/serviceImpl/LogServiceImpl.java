package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.logs.ActivityLogDto;
import app.hub_backend.DTO.logs.MealDto;
import app.hub_backend.DTO.logs.SymptomNoteDto;
import app.hub_backend.DTO.logs.LogRequestDto;
import app.hub_backend.entities.*;
import app.hub_backend.mapper.ActivityLogMapper;
import app.hub_backend.mapper.MealMapper;
import app.hub_backend.mapper.SymptomNoteMapper;
import app.hub_backend.repositories.*;
import app.hub_backend.service.AuthService;
import app.hub_backend.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LogServiceImpl implements LogService {

    private final MealRepository mealRepository;
    private final SymptomNoteRepository symptomNoteRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository; // For getting references
    private final AuthService authService;

    // --- Meal Logs ---
    @Override
    public MealDto createMealLog(UUID patientId, LogRequestDto.MealLog request) {
        User currentUser = authService.currentUser();
        User patientRef = userRepository.getReferenceById(patientId);

        Meal meal = Meal.builder()
                .patient(patientRef)
                .loggedAt(request.loggedAt())
                .description(request.description())
                .carbsG(request.carbsG())
                .createdBy(currentUser)
                .createdAt(OffsetDateTime.now())
                .build();
        return MealMapper.toDto(mealRepository.save(meal));
    }

    @Override
    public List<MealDto> getMealLogs(UUID patientId) {
        return mealRepository.findByPatientIdOrderByLoggedAtDesc(patientId)
                .stream()
                .map(MealMapper::toDto)
                .collect(Collectors.toList());
    }

    // --- Symptom Logs ---
    @Override
    public SymptomNoteDto createSymptomLog(UUID patientId, LogRequestDto.SymptomLog request) {
        User currentUser = authService.currentUser();
        User patientRef = userRepository.getReferenceById(patientId);

        SymptomNote symptom = SymptomNote.builder()
                .patient(patientRef)
                .occurredAt(request.occurredAt())
                .symptom(request.symptom())
                .severity(request.severity())
                .notes(request.notes())
                .createdBy(currentUser)
                .createdAt(OffsetDateTime.now())
                .build();
        return SymptomNoteMapper.toDto(symptomNoteRepository.save(symptom));
    }

    @Override
    public List<SymptomNoteDto> getSymptomLogs(UUID patientId) {
        return symptomNoteRepository.findByPatientIdOrderByOccurredAtDesc(patientId)
                .stream()
                .map(SymptomNoteMapper::toDto)
                .collect(Collectors.toList());
    }

    // --- Activity Logs ---
    @Override
    public ActivityLogDto createActivityLog(UUID patientId, LogRequestDto.ActivityLog request) {
        User currentUser = authService.currentUser();
        User patientRef = userRepository.getReferenceById(patientId);

        ActivityLog activity = ActivityLog.builder()
                .patient(patientRef)
                .startedAt(request.startedAt())
                .endedAt(request.endedAt())
                .activityType(request.activityType())
                .intensity(request.intensity())
                .notes(request.notes())
                .createdBy(currentUser)
                .createdAt(OffsetDateTime.now())
                .build();
        return ActivityLogMapper.toDto(activityLogRepository.save(activity));
    }

    @Override
    public List<ActivityLogDto> getActivityLogs(UUID patientId) {
        return activityLogRepository.findByPatientIdOrderByStartedAtDesc(patientId)
                .stream()
                .map(ActivityLogMapper::toDto)
                .collect(Collectors.toList());
    }
}