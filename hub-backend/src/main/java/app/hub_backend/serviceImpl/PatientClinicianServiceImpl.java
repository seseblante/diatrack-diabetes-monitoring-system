package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.PatientClinicianDto;
import app.hub_backend.entities.PatientClinician;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.PatientClinicianMapper;
import app.hub_backend.repositories.PatientClinicianRepository;
import app.hub_backend.repositories.UserRepository;
import app.hub_backend.service.PatientClinicianService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List; // ADD THIS IMPORT
import java.util.UUID;
import java.util.stream.Collectors; // ADD THIS IMPORT

@Service
@RequiredArgsConstructor
public class PatientClinicianServiceImpl implements PatientClinicianService {

    private final PatientClinicianRepository patientClinicianRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public PatientClinicianDto createLink(UUID patientId, UUID clinicianId) {
        User patient = userRepository.getReferenceById(patientId);
        User clinician = userRepository.getReferenceById(clinicianId);

        PatientClinician link = PatientClinician.builder()
                .patient(patient)
                .clinician(clinician)
                .build();

        PatientClinician savedLink = patientClinicianRepository.save(link);
        return PatientClinicianMapper.toDto(savedLink);
    }

    // NEW METHODS
    @Override
    @Transactional(readOnly = true)
    public List<PatientClinicianDto> getCliniciansForPatient(UUID patientId) {
        return patientClinicianRepository.findByPatientId(patientId)
                .stream()
                .map(PatientClinicianMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PatientClinicianDto> getPatientsForClinician(UUID clinicianId) {
        return patientClinicianRepository.findByClinicianId(clinicianId)
                .stream()
                .map(PatientClinicianMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PatientClinicianDto updateNextAppointment(UUID linkId, java.time.OffsetDateTime nextAppointmentAt) {
        PatientClinician link = patientClinicianRepository.findById(linkId)
                .orElseThrow(() -> new RuntimeException("Patient-Clinician link not found"));
        
        link.setNextAppointmentAt(nextAppointmentAt);
        PatientClinician updatedLink = patientClinicianRepository.save(link);
        
        return PatientClinicianMapper.toDto(updatedLink);
    }
}