package com.carepulse.service;


import com.carepulse.dto.*;
import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Ward;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BedService {
    List<BedResponse> getAllBeds(Ward ward, BedStatus status, Boolean hasVentilator, String search);

    @Transactional(readOnly = true)
    BedResponse getBedById(Long id);

    MetricsResponse getMetrics();

    @Transactional
    BedResponse createBed(CreateBedRequest request);

    BedResponse reserveBed(Long id, ReserveBedRequest request, String performedBy);

    BedResponse updateBedStatus(Long id, UpdateBedStatusRequest request, String performedBy);
}
