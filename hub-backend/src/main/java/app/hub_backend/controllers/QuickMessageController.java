package app.hub_backend.controllers;

import app.hub_backend.DTO.patient.QuickMessageDto;
import app.hub_backend.DTO.patient.QuickMessageRequestDto;
import app.hub_backend.service.QuickMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class QuickMessageController {

    private final QuickMessageService quickMessageService;

    @GetMapping("/link/{patientClinicianLinkId}")
    public ResponseEntity<List<QuickMessageDto>> getMessages(
            @PathVariable("patientClinicianLinkId") UUID patientClinicianLinkId   // ✅ FIXED
    ) {
        List<QuickMessageDto> messages =
                quickMessageService.getMessagesForLink(patientClinicianLinkId);

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/link/{patientClinicianLinkId}")
    public ResponseEntity<QuickMessageDto> sendMessage(
            @PathVariable("patientClinicianLinkId") UUID patientClinicianLinkId,  // ✅ FIXED
            @Valid @RequestBody QuickMessageRequestDto request
    ) {
        // This endpoint is for CLINICIANS
        QuickMessageDto newMessage =
                quickMessageService.sendMessage(patientClinicianLinkId, request);

        return ResponseEntity.ok(newMessage);
    }

    @PostMapping("/link/{patientClinicianLinkId}/read")
    public ResponseEntity<List<QuickMessageDto>> markAsRead(
            @PathVariable("patientClinicianLinkId") UUID patientClinicianLinkId   // ✅ FIXED
    ) {
        // This endpoint is for PATIENTS
        List<QuickMessageDto> updatedMessages =
                quickMessageService.markMessagesAsRead(patientClinicianLinkId);

        return ResponseEntity.ok(updatedMessages);
    }
}
