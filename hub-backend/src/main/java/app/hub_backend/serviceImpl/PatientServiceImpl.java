package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.patient.PatientDetailDto;
import app.hub_backend.DTO.patient.PatientSettingsDto;
import app.hub_backend.DTO.patient.PatientUpdateRequest;
import app.hub_backend.entities.PatientSettings;
import app.hub_backend.entities.User;
import app.hub_backend.entities.UserProfile;
import app.hub_backend.mapper.PatientMapper;
import app.hub_backend.mapper.UserMapper;
import app.hub_backend.repositories.PatientSettingsRepository;
import app.hub_backend.repositories.UserProfileRepository;
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
    private final UserProfileRepository userProfileRepository;

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

    @Override
    @Transactional(readOnly = true)
    public PatientDetailDto getPatientProfile(UUID patientId) {
        User user = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        UserProfile profile = userProfileRepository.findById(patientId).orElse(null);
        
        return UserMapper.toPatientDetailDto(user, profile);
    }

    @Override
    @Transactional
    public PatientDetailDto updatePatientProfile(UUID patientId, PatientUpdateRequest updateRequest) {
        User user = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        // Update User fields
        if (updateRequest.fullName() != null) {
            user.setFullName(updateRequest.fullName());
        }
        if (updateRequest.phone() != null) {
            user.setPhone(updateRequest.phone());
        }
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
        
        // Update or create UserProfile
        UserProfile profile = userProfileRepository.findById(patientId)
                .orElseGet(() -> {
                    UserProfile newProfile = new UserProfile();
                    newProfile.setUser(user);
                    newProfile.setCreatedAt(OffsetDateTime.now());
                    return newProfile;
                });
        
        if (updateRequest.dob() != null) {
            profile.setDob(updateRequest.dob());
        }
        if (updateRequest.sex() != null) {
            profile.setSex(updateRequest.sex());
        }
        if (updateRequest.timezone() != null) {
            profile.setTimezone(updateRequest.timezone());
        }
        profile.setUpdatedAt(OffsetDateTime.now());
        userProfileRepository.save(profile);
        
        return UserMapper.toPatientDetailDto(user, profile);
    }
}