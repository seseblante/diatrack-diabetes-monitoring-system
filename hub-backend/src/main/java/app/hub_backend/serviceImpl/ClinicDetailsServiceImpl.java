package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.patient.ClinicDetailsDto;
import app.hub_backend.DTO.patient.ClinicDetailsRequestDto;
import app.hub_backend.entities.ClinicDetails;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.ClinicDetailsMapper;
import app.hub_backend.repositories.ClinicDetailsRepository;
import app.hub_backend.service.AuthService;
import app.hub_backend.service.ClinicDetailsService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClinicDetailsServiceImpl implements ClinicDetailsService {

    private final ClinicDetailsRepository clinicDetailsRepository;
    private final AuthService authService;
    // We don't need UserRepository here since AuthService gives us the full User object

    /**
     * Get clinic details by clinician ID.
     * Anyone (like a patient) can call this.
     */
    @Override
    @Transactional(readOnly = true)
    public ClinicDetailsDto getClinicDetails(UUID clinicianId) {
        ClinicDetails details = clinicDetailsRepository.findByClinicianId(clinicianId)
                .orElseThrow(() -> new EntityNotFoundException("Clinic details not found for clinician: " + clinicianId));
        return ClinicDetailsMapper.toDto(details);
    }

    /**
     * Get details for the *currently logged-in* clinician.
     */
    @Override
    @Transactional(readOnly = true)
    public ClinicDetailsDto getMyClinicDetails() {
        User currentUser = authService.currentUser();

        // Ensure user is a clinician
        if (!"CLINICIAN".equals(currentUser.getRole())) {
            throw new IllegalStateException("Only clinicians can access this resource.");
        }

        ClinicDetails details = clinicDetailsRepository.findByClinicianId(currentUser.getId())
                .orElseThrow(() -> new EntityNotFoundException("Clinic details not set up for clinician: " + currentUser.getId()));

        return ClinicDetailsMapper.toDto(details);
    }

    /**
     * Create or Update details for the *currently logged-in* clinician.
     * This is an "upsert" operation.
     */
    @Override
    @Transactional
    public ClinicDetailsDto updateMyClinicDetails(ClinicDetailsRequestDto request) {
        User currentUser = authService.currentUser();

        if (!"CLINICIAN".equals(currentUser.getRole())) {
            throw new IllegalStateException("Only clinicians can update clinic details.");
        }

        // Find existing details or create a new one
        ClinicDetails details = clinicDetailsRepository.findByClinicianId(currentUser.getId())
                .orElse(new ClinicDetails()); // Create new if not found

        // Set clinician if it's a new record
        if (details.getId() == null) {
            details.setClinician(currentUser);
        }

        // Map request DTO fields to the entity
        details.setClinicName(request.clinicName());
        details.setAddress(request.address());
        details.setScheduleDays(request.scheduleDays());
        details.setScheduleHours(request.scheduleHours());
        details.setContactPerson(request.contactPerson());
        details.setContactPhone(request.contactPhone());
        details.setUpdatedAt(OffsetDateTime.now());

        ClinicDetails savedDetails = clinicDetailsRepository.save(details);
        return ClinicDetailsMapper.toDto(savedDetails);
    }
}