package app.hub_backend.service;

import app.hub_backend.DTO.patient.PatientDetailDto;
import app.hub_backend.DTO.patient.PatientSettingsDto;
import app.hub_backend.DTO.patient.PatientUpdateRequest;
import java.util.UUID;

public interface PatientService {
    PatientSettingsDto getPatientSettings(UUID patientId);
    PatientSettingsDto updatePatientSettings(UUID patientId, PatientSettingsDto settingsDto);
    PatientDetailDto getPatientProfile(UUID patientId);
    PatientDetailDto updatePatientProfile(UUID patientId, PatientUpdateRequest updateRequest);
}