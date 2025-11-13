package app.hub_backend.DTO.shared;

import java.util.UUID;

public record EducationalResourceDto(
        UUID id,
        String category,
        String title,
        String content
) {}