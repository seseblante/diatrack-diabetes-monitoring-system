package app.hub_backend.service;

import app.hub_backend.DTO.medication.MedicationLogDto;
import app.hub_backend.DTO.medication.MedicationRegimenDto;
import app.hub_backend.DTO.medication.MedicationRegimenRequest;
import app.hub_backend.DTO.medication.MedicationRequestDto;
import java.util.List;
import java.util.UUID;

public interface MedicationService {
    // Regimen Management
    MedicationRegimenDto createMedicationRegimen(UUID patientId, MedicationRegimenRequest request);
    List<MedicationRegimenDto> getActiveRegimens(UUID patientId);
    MedicationRegimenDto updateMedicationRegimen(UUID regimenId, MedicationRegimenRequest request);

    // Logging
    MedicationLogDto createMedicationLog(MedicationRequestDto.LogTaken request);
    List<MedicationLogDto> getMedicationLogs(UUID patientId);
    void deleteMedicationLog(UUID logId);
}