package com.carepulse.service.Impl;

import com.carepulse.dto.BedResponse;
import com.carepulse.dto.MetricsResponse;
import com.carepulse.dto.ReserveBedRequest;
import com.carepulse.dto.UpdateBedStatusRequest;
import com.carepulse.entity.AuditLog;
import com.carepulse.entity.Bed;
import com.carepulse.entity.Patient;
import com.carepulse.enums.AuditAction;
import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Ward;
import com.carepulse.exception.InvalidStatusTransitionException;
import com.carepulse.exception.ResourceNotFoundException;
import com.carepulse.mapper.BedMapper;
import com.carepulse.mapper.PatientMapper;
import com.carepulse.repository.AuditLogRepository;
import com.carepulse.repository.BedRepository;
import com.carepulse.repository.PatientRepository;
import com.carepulse.service.BedService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BedServiceImpl implements BedService {

    private final BedRepository bedRepository;
    private final PatientRepository patientRepository;
    private final AuditLogRepository auditLogRepository;
    private final BedMapper bedMapper;
    private final PatientMapper patientMapper;

    @Override
    @Transactional(readOnly = true)
    public List<BedResponse> getAllBeds(Ward ward, BedStatus status, Boolean hasVentilator, String search) {
        return bedRepository.findAll().stream()
                .filter(b -> ward == null || b.getWard() == ward)
                .filter(b -> status == null || b.getStatus() == status)
                .filter(b -> hasVentilator == null || b.getHasVentilator().equals(hasVentilator))
                .filter(b -> search == null || search.isBlank() ||
                        b.getBedNumber().toLowerCase().contains(search.toLowerCase()))
                .map(bedMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MetricsResponse getMetrics() {
        return MetricsResponse.builder()
                .totalIcuBeds(bedRepository.countIcuBeds())
                .availableIcuBeds(bedRepository.countAvailableIcuBeds())
                .activeVentilators(bedRepository.countActiveVentilators())
                .cleaningBeds(bedRepository.countCleaningBeds())
                .build();
    }

    @Override
    @Transactional
    public BedResponse reserveBed(Long id, ReserveBedRequest request, String performedBy) {
        Bed bed = bedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found with id: " + id));

        if (bed.getStatus() != BedStatus.AVAILABLE) {
            throw new InvalidStatusTransitionException(
                    "Bed " + bed.getBedNumber() + " is not available for reservation. Current status: " + bed.getStatus());
        }

        Patient patient = patientRepository.findByPatientId(request.getPatientId())
                .orElseGet(() -> {
                    Patient newPatient = patientMapper.toEntity(request);
                    newPatient.setAdmittedAt(LocalDateTime.now());
                    return patientRepository.save(newPatient);
                });

        bed.setStatus(BedStatus.RESERVED);
        bed.setCurrentPatient(patient);
        Bed savedBed = bedRepository.save(bed);

        createAuditLog(
                savedBed.getBedNumber(),
                patient.getPatientId(),
                AuditAction.BED_RESERVED,
                performedBy,
                "AVAILABLE -> RESERVED"
        );

        return bedMapper.toResponse(savedBed);
    }

    @Override
    @Transactional
    public BedResponse updateBedStatus(Long id, UpdateBedStatusRequest request, String performedBy) {
        Bed bed = bedRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bed not found with id: " + id));

        BedStatus currentStatus = bed.getStatus();
        BedStatus newStatus = request.getNewStatus();

        validateStatusTransition(currentStatus, newStatus);

        String statusTransition = currentStatus + " -> " + newStatus;
        AuditAction auditAction = determineAuditAction(currentStatus, newStatus);
        String patientId = bed.getCurrentPatient() != null ? bed.getCurrentPatient().getPatientId() : null;

        if (currentStatus == BedStatus.OCCUPIED && newStatus == BedStatus.CLEANING) {
            bed.setCurrentPatient(null);
        } else if (currentStatus == BedStatus.CLEANING && newStatus == BedStatus.AVAILABLE) {
            bed.setCurrentPatient(null);
        }

        bed.setStatus(newStatus);
        Bed savedBed = bedRepository.save(bed);

        createAuditLog(
                savedBed.getBedNumber(),
                patientId,
                auditAction,
                performedBy,
                statusTransition
        );

        return bedMapper.toResponse(savedBed);
    }

    private void validateStatusTransition(BedStatus from, BedStatus to) {
        boolean valid = switch (from) {
            case AVAILABLE -> to == BedStatus.RESERVED;
            case RESERVED -> to == BedStatus.OCCUPIED;
            case OCCUPIED -> to == BedStatus.CLEANING;
            case CLEANING -> to == BedStatus.AVAILABLE;
        };

        if (!valid) {
            throw new InvalidStatusTransitionException(
                    "Invalid status transition: " + from + " -> " + to +
                            ". Allowed transitions: AVAILABLE->RESERVED, RESERVED->OCCUPIED, OCCUPIED->CLEANING, CLEANING->AVAILABLE");
        }
    }

    private AuditAction determineAuditAction(BedStatus from, BedStatus to) {
        if (from == BedStatus.AVAILABLE && to == BedStatus.RESERVED) {
            return AuditAction.BED_RESERVED;
        } else if (from == BedStatus.RESERVED && to == BedStatus.OCCUPIED) {
            return AuditAction.PATIENT_ADMITTED;
        } else if (from == BedStatus.OCCUPIED && to == BedStatus.CLEANING) {
            return AuditAction.PATIENT_DISCHARGED;
        } else if (from == BedStatus.CLEANING && to == BedStatus.AVAILABLE) {
            return AuditAction.BED_CLEANED;
        }
        throw new InvalidStatusTransitionException("Unrecognized status transition for audit logging.");
    }

    private void createAuditLog(String bedNumber, String patientId, AuditAction action,
                                String performedBy, String statusTransition) {
        AuditLog log = AuditLog.builder()
                .timeStamp(LocalDateTime.now())
                .bedNumber(bedNumber)
                .patientId(patientId)
                .action(action)
                .performedBy(performedBy)
                .statusTransition(statusTransition)
                .build();
        auditLogRepository.save(log);
    }

}
