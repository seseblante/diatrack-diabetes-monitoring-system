package app.hub_backend.service;

import app.hub_backend.DTO.patient.ClinicDetailsDto;
import app.hub_backend.DTO.patient.ClinicDetailsRequestDto;

import java.util.UUID;

public interface ClinicDetailsService {

    /**
     * Get clinic details for a specific clinician.
     * This will be used by patients.
     */
    ClinicDetailsDto getClinicDetails(UUID clinicianId);

    /**
     * Get clinic details for the currently logged-in clinician.
     * This will be used by the clinician to view their own profile.
     */
    ClinicDetailsDto getMyClinicDetails();

    /**
     * Create or update the clinic details for the currently logged-in clinician.
     * This is the "upsert" operation.
     */
    ClinicDetailsDto updateMyClinicDetails(ClinicDetailsRequestDto request);
}