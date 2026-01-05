package app.hub_backend.service;

import app.hub_backend.DTO.patient.QuickMessageDto;
import app.hub_backend.DTO.patient.QuickMessageRequestDto;

import java.util.List;
import java.util.UUID;

public interface QuickMessageService {

    List<QuickMessageDto> getMessagesForLink(UUID patientClinicianLinkId);

    QuickMessageDto sendMessage(UUID patientClinicianLinkId, QuickMessageRequestDto request);

    List<QuickMessageDto> markMessagesAsRead(UUID patientClinicianLinkId);

    long getUnreadCountForLink(UUID patientClinicianLinkId);
}