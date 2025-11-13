package app.hub_backend.service;

import app.hub_backend.DTO.shared.EducationalResourceDto;

import java.util.List;

public interface EducationalResourceService {
    List<EducationalResourceDto> getActiveResources();
}