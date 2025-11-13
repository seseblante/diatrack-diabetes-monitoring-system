package app.hub_backend.DTO.patient;

import java.time.OffsetDateTime;
import java.util.UUID;

public record QuickMessageDto(
        UUID id,
        UUID patientClinicianLinkId,
        UUID senderId, // Helper to know who sent it
        String messageContent,
        String status,
        OffsetDateTime createdAt,
        OffsetDateTime readAt
) {}