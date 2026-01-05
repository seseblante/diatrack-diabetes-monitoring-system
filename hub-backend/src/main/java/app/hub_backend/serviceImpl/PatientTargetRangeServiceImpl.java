package app.hub_backend.serviceImpl;

import app.hub_backend.DTO.patient.PatientTargetRangeDto;
import app.hub_backend.DTO.patient.PatientTargetRangeRequestDto;
import app.hub_backend.entities.PatientTargetRange;
import app.hub_backend.entities.User;
import app.hub_backend.entities.enums.GlucoseContext;
import app.hub_backend.mapper.PatientTargetRangeMapper;
import app.hub_backend.repositories.PatientTargetRangeRepository;
import app.hub_backend.service.PatientTargetRangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientTargetRangeServiceImpl implements PatientTargetRangeService {

    private final PatientTargetRangeRepository targetRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PatientTargetRangeDto> getTargetsByPatient(UUID patientId) {
        return targetRepository.findByPatientId(patientId)
                .stream()
                .map(PatientTargetRangeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PatientTargetRangeDto createOrUpdateTarget(UUID patientId, PatientTargetRangeRequestDto request) {

        PatientTargetRange range = targetRepository.findByPatientIdAndContext(patientId, request.context())
                .orElse(new PatientTargetRange());

        if (range.getId() == null) {
            User patientRef = new User();
            patientRef.setId(patientId);
            range.setPatient(patientRef);
            range.setContext(request.context());
        }

        range.setTargetLowMgdl(request.targetLowMgdl());
        range.setTargetHighMgdl(request.targetHighMgdl());

        PatientTargetRange savedRange = targetRepository.save(range);
        return PatientTargetRangeMapper.toDto(savedRange);
    }

    @Override
    @Transactional
    public void createDefaultTargetsForNewPatient(User patient) {

        User patientRef = new User();
        patientRef.setId(patient.getId());

        // [FIXED] Using UPPER_CASE constants to match your enum
        List<DefaultRange> defaults = Arrays.asList(
                new DefaultRange(GlucoseContext.FASTING, new BigDecimal("71.00"), new BigDecimal("99.00")),
                new DefaultRange(GlucoseContext.BEFORE_MEAL, new BigDecimal("71.00"), new BigDecimal("99.00")),
                new DefaultRange(GlucoseContext.AFTER_MEAL, new BigDecimal("71.00"), new BigDecimal("140.00")),
                new DefaultRange(GlucoseContext.BEDTIME, new BigDecimal("100.00"), new BigDecimal("140.00"))
                // Removed RANDOM as it violates DB constraint
        );

        List<PatientTargetRange> newRanges = defaults.stream()
                .map(def -> PatientTargetRange.builder()
                        .patient(patientRef)
                        .context(def.context)
                        .targetLowMgdl(def.low)
                        .targetHighMgdl(def.high)
                        .build())
                .collect(Collectors.toList());

        targetRepository.saveAll(newRanges);
    }

    private record DefaultRange(GlucoseContext context, BigDecimal low, BigDecimal high) {}
}