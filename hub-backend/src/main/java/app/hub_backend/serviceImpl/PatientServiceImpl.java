package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.patient.PatientSettingsDto;
import app.hub_backend.entities.PatientSettings;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.PatientMapper;
import app.hub_backend.repositories.PatientSettingsRepository;
import app.hub_backend.repositories.UserRepository;
import app.hub_backend.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Import this

import java.math.BigDecimal;
import java.time.OffsetDateTime; // <-- Import this
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientSettingsRepository settingsRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional // Use @Transactional
    public PatientSettingsDto getPatientSettings(UUID patientId) {
        return settingsRepository.findById(patientId)
                .map(PatientMapper::toDto) // This reference is fine for a .map()
                .orElseGet(() -> {
                    var patientRef = userRepository.getReferenceById(patientId);
                    PatientSettings defaultSettings = PatientSettings.builder()
                            .patient(patientRef)
                            .trendWindowDays(7)
                            .updatedAt(OffsetDateTime.now())
                            .build();

                    // [FIXED] Use static call syntax here
                    return PatientMapper.toDto(settingsRepository.save(defaultSettings));
                });
    }

    @Override
    @Transactional
    public PatientSettingsDto updatePatientSettings(UUID patientId, PatientSettingsDto settingsDto) {

        // "Upsert" logic: Find existing or create new
        PatientSettings settings = settingsRepository.findById(patientId)
                .orElseGet(() -> {
                    User patientRef = userRepository.getReferenceById(patientId);
                    return PatientSettings.builder()
                            .patient(patientRef)
                            .build();
                });

        // Update fields from DTO
        settings.setTrendWindowDays(settingsDto.trendWindowDays()); // <-- This now works
        settings.setSevereLowMgdl(new BigDecimal("54.00"));
        settings.setSevereHighMgdl(new BigDecimal("250.00"));
        settings.setUpdatedAt(OffsetDateTime.now());

        PatientSettings updatedSettings = settingsRepository.save(settings);

        // [FIXED] Use static call syntax here, not method reference
        return PatientMapper.toDto(updatedSettings);
    }
}