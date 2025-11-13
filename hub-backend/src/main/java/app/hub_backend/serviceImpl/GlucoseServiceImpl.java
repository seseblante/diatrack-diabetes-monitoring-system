package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.glucose.GlucoseLogRequestDto;
import app.hub_backend.DTO.logs.GlucoseReadingDto;
import app.hub_backend.entities.GlucoseReading;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.GlucoseReadingMapper;
import app.hub_backend.repositories.GlucoseReadingRepository;
import app.hub_backend.repositories.UserRepository;
import app.hub_backend.service.AlertService;
import app.hub_backend.service.AuthService;
import app.hub_backend.service.GlucoseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GlucoseServiceImpl implements GlucoseService {

    private final GlucoseReadingRepository glucoseReadingRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final AlertService alertService;

    @Override
    public GlucoseReadingDto logGlucoseReading(UUID patientId, GlucoseLogRequestDto request) {
        User currentUser = authService.currentUser();
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        GlucoseReading reading = GlucoseReading.builder()
                .patient(patient)
                .measuredAt(request.measuredAt())
                .lastMealAt(request.lastMealAt())
                .valueMgdl(request.valueMgdl())
                .context(request.context())
                .createdBy(currentUser)
                .createdAt(OffsetDateTime.now())
                .build();

        GlucoseReading savedReading = glucoseReadingRepository.save(reading);
        alertService.checkForAlerts(savedReading);
        return GlucoseReadingMapper.toDto(savedReading);
    }

    @Override
    public List<GlucoseReadingDto> getGlucoseReadingsForPatient(UUID patientId) {
        return glucoseReadingRepository.findByPatientIdOrderByMeasuredAtDesc(patientId)
                .stream()
                .map(GlucoseReadingMapper::toDto)
                .collect(Collectors.toList());
    }
}