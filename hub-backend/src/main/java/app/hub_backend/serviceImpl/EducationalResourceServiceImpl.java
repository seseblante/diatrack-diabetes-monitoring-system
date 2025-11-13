package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.shared.EducationalResourceDto;
import app.hub_backend.entities.EducationalResource;
import app.hub_backend.repositories.EducationalResourceRepository;
import app.hub_backend.service.EducationalResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EducationalResourceServiceImpl implements EducationalResourceService {

    private final EducationalResourceRepository educationalResourceRepository;

    @Override
    public List<EducationalResourceDto> getActiveResources() {
        return educationalResourceRepository.findByIsActiveTrueOrderByCategory()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private EducationalResourceDto toDto(EducationalResource entity) {
        return new EducationalResourceDto(
                entity.getId(),
                entity.getCategory(),
                entity.getTitle(),
                entity.getContent()
        );
    }
}