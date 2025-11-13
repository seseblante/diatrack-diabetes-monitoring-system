package app.hub_backend.service;

import app.hub_backend.DTO.glucose.GlucoseLogRequestDto;
import app.hub_backend.DTO.logs.GlucoseReadingDto;
import java.util.List;
import java.util.UUID;

public interface GlucoseService {
    GlucoseReadingDto logGlucoseReading(UUID patientId, GlucoseLogRequestDto request);
    List<GlucoseReadingDto> getGlucoseReadingsForPatient(UUID patientId);
}