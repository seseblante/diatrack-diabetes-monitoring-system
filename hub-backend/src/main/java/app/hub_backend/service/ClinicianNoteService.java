package app.hub_backend.service;

import app.hub_backend.DTO.patient.ClinicianNoteDto;
import app.hub_backend.DTO.patient.ClinicianNoteRequestDto;

import java.util.List;
import java.util.UUID;

public interface ClinicianNoteService {

    List<ClinicianNoteDto> getNotesForLink(UUID patientClinicianLinkId);

    ClinicianNoteDto createNoteForLink(UUID patientClinicianLinkId, ClinicianNoteRequestDto request);

    ClinicianNoteDto updateNote(UUID noteId, ClinicianNoteRequestDto request);

    void deleteNote(UUID noteId);
}