package app.hub_backend.service;

import java.util.UUID;

public interface ReportService {
    byte[] generatePatientPdfReport(UUID patientId);
}