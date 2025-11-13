package app.hub_backend.controllers;

import app.hub_backend.DTO.shared.EducationalResourceDto;
import app.hub_backend.service.EducationalResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
public class EducationalResourceController {

    private final EducationalResourceService educationalResourceService;

    @GetMapping("/resources")
    public ResponseEntity<List<EducationalResourceDto>> getActiveResources() {
        List<EducationalResourceDto> resources = educationalResourceService.getActiveResources();
        return ResponseEntity.ok(resources);
    }
}