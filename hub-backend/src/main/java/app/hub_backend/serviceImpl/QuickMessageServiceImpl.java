package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.patient.QuickMessageDto;
import app.hub_backend.DTO.patient.QuickMessageRequestDto;
import app.hub_backend.entities.PatientClinician;
import app.hub_backend.entities.QuickMessage;
import app.hub_backend.entities.User;
import app.hub_backend.mapper.QuickMessageMapper;
import app.hub_backend.repositories.PatientClinicianRepository;
import app.hub_backend.repositories.QuickMessageRepository;
import app.hub_backend.service.AuthService;
import app.hub_backend.service.QuickMessageService;
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
public class QuickMessageServiceImpl implements QuickMessageService {

    private final QuickMessageRepository quickMessageRepository;
    private final PatientClinicianRepository patientClinicianRepository;
    private final AuthService authService;

    @Override
    @Transactional(readOnly = true)
    public List<QuickMessageDto> getMessagesForLink(UUID patientClinicianLinkId) {
        User currentUser = authService.currentUser();
        getLinkAndVerifyAccess(patientClinicianLinkId, currentUser);

        return quickMessageRepository.findByPatientClinicianLinkIdOrderByCreatedAtDesc(patientClinicianLinkId)
                .stream()
                .map(QuickMessageMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuickMessageDto sendMessage(UUID patientClinicianLinkId, QuickMessageRequestDto request) {
        User currentUser = authService.currentUser();
        PatientClinician link = patientClinicianRepository.findById(patientClinicianLinkId)
                .orElseThrow(() -> new EntityNotFoundException("Patient-Clinician link not found: " + patientClinicianLinkId));

        // Only the clinician on this link can send a message
        if (!"CLINICIAN".equals(currentUser.getRole()) || !link.getClinician().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only the assigned clinician can send messages.");
        }

        QuickMessage message = QuickMessage.builder()
                .patientClinicianLink(link)
                .messageContent(request.messageContent())
                .status("SENT")
                .createdAt(OffsetDateTime.now())
                .build();

        QuickMessage savedMessage = quickMessageRepository.save(message);
        return QuickMessageMapper.toDto(savedMessage);
    }

    @Override
    @Transactional
    public List<QuickMessageDto> markMessagesAsRead(UUID patientClinicianLinkId) {
        User currentUser = authService.currentUser();
        PatientClinician link = getLinkAndVerifyAccess(patientClinicianLinkId, currentUser);

        // Only the patient on this link can mark messages as read
        if (!"PATIENT".equals(currentUser.getRole()) || !link.getPatient().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Only the patient can mark messages as read.");
        }

        List<QuickMessage> unreadMessages = quickMessageRepository
                .findByPatientClinicianLinkIdAndStatus(patientClinicianLinkId, "SENT");

        OffsetDateTime now = OffsetDateTime.now();
        unreadMessages.forEach(msg -> {
            msg.setStatus("READ");
            msg.setReadAt(now);
        });

        List<QuickMessage> savedMessages = quickMessageRepository.saveAll(unreadMessages);
        return savedMessages.stream()
                .map(QuickMessageMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCountForLink(UUID patientClinicianLinkId) {
        User currentUser = authService.currentUser();
        getLinkAndVerifyAccess(patientClinicianLinkId, currentUser);

        return quickMessageRepository.countByPatientClinicianLinkIdAndStatus(
                patientClinicianLinkId, "SENT"
        );
    }

    private PatientClinician getLinkAndVerifyAccess(UUID linkId, User user) {
        PatientClinician link = patientClinicianRepository.findById(linkId)
                .orElseThrow(() -> new EntityNotFoundException("Patient-Clinician link not found: " + linkId));

        // User must be either the patient or the clinician on this link
        boolean isPatient = "PATIENT".equals(user.getRole()) && link.getPatient().getId().equals(user.getId());
        boolean isClinician = "CLINICIAN".equals(user.getRole()) && link.getClinician().getId().equals(user.getId());

        if (!isPatient && !isClinician) {
            throw new AccessDeniedException("You do not have permission to access these messages.");
        }
        return link;
    }
}