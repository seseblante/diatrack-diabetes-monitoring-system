package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.patient.ClinicianNoteDto;
import app.hub_backend.DTO.patient.ClinicianNoteRequestDto;
import app.hub_backend.entities.ClinicianNote;
import app.hub_backend.entities.PatientClinician;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.ClinicianNoteMapper;
import app.hub_backend.repositories.ClinicianNoteRepository;
import app.hub_backend.repositories.PatientClinicianRepository;
import app.hub_backend.service.AuthService;
import app.hub_backend.service.ClinicianNoteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicianNoteServiceImpl implements ClinicianNoteService {

    private final ClinicianNoteRepository clinicianNoteRepository;
    private final PatientClinicianRepository patientClinicianRepository;
    private final AuthService authService;

    @Override
    @Transactional(readOnly = true)
    public List<ClinicianNoteDto> getNotesForLink(UUID patientClinicianLinkId) {
        User currentUser = authService.currentUser();
        PatientClinician link = getLinkAndVerifyAccess(patientClinicianLinkId, currentUser);

        return clinicianNoteRepository.findByPatientClinicianLinkIdOrderByCreatedAtDesc(link.getId())
                .stream()
                .map(ClinicianNoteMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClinicianNoteDto createNoteForLink(UUID patientClinicianLinkId, ClinicianNoteRequestDto request) {
        User currentUser = authService.currentUser();
        PatientClinician link = getLinkAndVerifyAccess(patientClinicianLinkId, currentUser);

        ClinicianNote note = ClinicianNote.builder()
                .patientClinicianLink(link)
                .noteContent(request.noteContent())
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        ClinicianNote savedNote = clinicianNoteRepository.save(note);
        return ClinicianNoteMapper.toDto(savedNote);
    }

    @Override
    @Transactional
    public ClinicianNoteDto updateNote(UUID noteId, ClinicianNoteRequestDto request) {
        User currentUser = authService.currentUser();
        ClinicianNote note = getNoteAndVerifyAccess(noteId, currentUser);

        note.setNoteContent(request.noteContent());
        note.setUpdatedAt(OffsetDateTime.now());

        ClinicianNote updatedNote = clinicianNoteRepository.save(note);
        return ClinicianNoteMapper.toDto(updatedNote);
    }

    @Override
    @Transactional
    public void deleteNote(UUID noteId) {
        User currentUser = authService.currentUser();
        ClinicianNote note = getNoteAndVerifyAccess(noteId, currentUser);

        clinicianNoteRepository.delete(note);
    }


    private PatientClinician getLinkAndVerifyAccess(UUID linkId, User user) {
        PatientClinician link = patientClinicianRepository.findById(linkId)
                .orElseThrow(() -> new EntityNotFoundException("Patient-Clinician link not found: " + linkId));

        // Only the clinician associated with this link can access it
        if (!"CLINICIAN".equals(user.getRole()) || !link.getClinician().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access these notes.");
        }
        return link;
    }

    private ClinicianNote getNoteAndVerifyAccess(UUID noteId, User user) {
        ClinicianNote note = clinicianNoteRepository.findById(noteId)
                .orElseThrow(() -> new EntityNotFoundException("Note not found: " + noteId));

        // Get the parent link and use the same access logic
        getLinkAndVerifyAccess(note.getPatientClinicianLink().getId(), user);

        return note;
    }
}