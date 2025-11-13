package app.hub_backend.service;

import app.hub_backend.DTO.history.HistoryResponseDto;
import java.util.UUID;

public interface HistoryService {
    HistoryResponseDto getComprehensiveHistory(UUID patientId);
}