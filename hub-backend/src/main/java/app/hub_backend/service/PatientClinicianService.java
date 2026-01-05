package app.hub_backend.service;

import app.hub_backend.DTO.AppointmentDto;
import app.hub_backend.DTO.PatientClinicianDto;
import app.hub_backend.entities.PatientClinician;

import java.time.OffsetDateTime;
import java.util.List; // ADD THIS IMPORT
import java.util.UUID;

public interface PatientClinicianService {
    PatientClinicianDto createLink(UUID patientId, UUID clinicianId);

    // NEW METHODS
    List<PatientClinicianDto> getCliniciansForPatient(UUID patientId);
    List<PatientClinicianDto> getPatientsForClinician(UUID clinicianId);
    PatientClinicianDto updateNextAppointment(UUID linkId, OffsetDateTime nextAppointmentAt);
    List<AppointmentDto> getAppointmentsForClinician(UUID clinicianId);
}