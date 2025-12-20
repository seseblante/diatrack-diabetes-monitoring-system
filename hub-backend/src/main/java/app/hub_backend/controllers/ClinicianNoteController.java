package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.ClinicianNoteDto;
import app.hub_backend.DTO.patient.ClinicianNoteRequestDto;
import app.hub_backend.service.ClinicianNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class ClinicianNoteController {

    private final ClinicianNoteService clinicianNoteService;

    @GetMapping("/link/{patientClinicianLinkId}")
    public ResponseEntity<List<ClinicianNoteDto>> getNotes(
            @PathVariable("patientClinicianLinkId") UUID patientClinicianLinkId
    ) {
        List<ClinicianNoteDto> notes =
                clinicianNoteService.getNotesForLink(patientClinicianLinkId);
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/link/{patientClinicianLinkId}")
    public ResponseEntity<ClinicianNoteDto> createNote(
            @PathVariable("patientClinicianLinkId") UUID patientClinicianLinkId,
            @Valid @RequestBody ClinicianNoteRequestDto request
    ) {
        ClinicianNoteDto newNote =
                clinicianNoteService.createNoteForLink(patientClinicianLinkId, request);
        return ResponseEntity.ok(newNote);
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<ClinicianNoteDto> updateNote(
            @PathVariable("noteId") UUID noteId,
            @Valid @RequestBody ClinicianNoteRequestDto request
    ) {
        ClinicianNoteDto updatedNote =
                clinicianNoteService.updateNote(noteId, request);
        return ResponseEntity.ok(updatedNote);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(
            @PathVariable("noteId") UUID noteId
    ) {
        clinicianNoteService.deleteNote(noteId);
        return ResponseEntity.noContent().build();
    }
}
