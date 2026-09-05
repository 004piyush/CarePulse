package com.carepulse.service;


import com.carepulse.dto.BedResponse;
import com.carepulse.dto.MetricsResponse;
import com.carepulse.dto.ReserveBedRequest;
import com.carepulse.dto.UpdateBedStatusRequest;
import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Ward;

import java.util.List;

public interface BedService {
    List<BedResponse> getAllBeds(Ward ward, BedStatus status, Boolean hasVentilator, String search);

    MetricsResponse getMetrics();

    BedResponse reserveBed(Long id, ReserveBedRequest request, String performedBy);

    BedResponse updateBedStatus(Long id, UpdateBedStatusRequest request, String performedBy);
}
