package app.hub_backend.repositories;

import app.hub_backend.entities.EducationalResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EducationalResourceRepository extends JpaRepository<EducationalResource, UUID> {
    List<EducationalResource> findByIsActiveTrueOrderByCategory();
}