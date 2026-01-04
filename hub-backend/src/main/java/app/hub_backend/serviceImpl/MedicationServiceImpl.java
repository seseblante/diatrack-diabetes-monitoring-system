package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.medication.MedicationLogDto;
import app.hub_backend.DTO.medication.MedicationRegimenDto;
import app.hub_backend.DTO.medication.MedicationRegimenRequest;
import app.hub_backend.DTO.medication.MedicationRequestDto;
import app.hub_backend.entities.MedicationLog;
import app.hub_backend.entities.MedicationRegimen;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.MedicationMapper;
import app.hub_backend.repositories.MedicationLogRepository;
import app.hub_backend.repositories.MedicationRegimenRepository;
import app.hub_backend.service.AuthService;
import app.hub_backend.service.MedicationService;
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
public class MedicationServiceImpl implements MedicationService {

    private final MedicationRegimenRepository regimenRepository;
    private final MedicationLogRepository logRepository;
    private final AuthService authService;

    @Override
    public MedicationRegimenDto createMedicationRegimen(UUID patientId, MedicationRegimenRequest request) {
        MedicationRegimen regimen = MedicationRegimen.builder()
                .patient(User.builder().id(patientId).build())
                .medicationName(request.medicationName())
                .doseAmount(request.doseAmount())
                .doseUnit(request.doseUnit())
                .frequencyType(request.frequencyType())
                .frequencyValue(request.frequencyValue())
                .timesOfDay(request.timesOfDay())
                .isActive(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();
        return MedicationMapper.toDto(regimenRepository.save(regimen));
    }

    @Override
    public List<MedicationRegimenDto> getActiveRegimens(UUID patientId) {
        return regimenRepository.findByPatientIdAndIsActiveTrueOrderByMedicationName(patientId)
                .stream()
                .map(MedicationMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MedicationRegimenDto updateMedicationRegimen(UUID regimenId, MedicationRegimenRequest request) {
        MedicationRegimen regimen = regimenRepository.findById(regimenId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medication regimen not found"));

        regimen.setMedicationName(request.medicationName());
        regimen.setDoseAmount(request.doseAmount());
        regimen.setDoseUnit(request.doseUnit());
        regimen.setFrequencyType(request.frequencyType());
        regimen.setFrequencyValue(request.frequencyValue());
        regimen.setTimesOfDay(request.timesOfDay());
        regimen.setUpdatedAt(OffsetDateTime.now());

        return MedicationMapper.toDto(regimenRepository.save(regimen));
    }

    @Override
    public MedicationLogDto createMedicationLog(MedicationRequestDto.LogTaken request) {
        User currentUser = authService.currentUser();
        MedicationRegimen regimen = regimenRepository.findById(request.regimenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medication regimen not found"));

        MedicationLog log = MedicationLog.builder()
                .regimen(regimen)
                .takenAt(request.takenAt())  // Use the timestamp from request
                .createdBy(currentUser)
                .createdAt(OffsetDateTime.now())
                .build();
        return MedicationMapper.toDto(logRepository.save(log));
    }

    @Override
    public void deleteMedicationLog(UUID logId) {
        MedicationLog log = logRepository.findById(logId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medication log not found"));
        logRepository.delete(log);
    }

    @Override
    public List<MedicationLogDto> getMedicationLogs(UUID patientId) {
        return logRepository.findByPatientId(patientId)
                .stream()
                .map(MedicationMapper::toDto)
                .collect(Collectors.toList());
    }
}