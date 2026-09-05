package com.carepulse.controller;

import com.carepulse.dto.BedResponse;
import com.carepulse.dto.MetricsResponse;
import com.carepulse.dto.ReserveBedRequest;
import com.carepulse.dto.UpdateBedStatusRequest;
import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Ward;
import com.carepulse.service.BedService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beds")
@RequiredArgsConstructor
public class BedController {

    private final BedService bedService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TRIAGE', 'ICU_MANAGER', 'ADMIN')")
    public ResponseEntity<List<BedResponse>> getAllBeds(
            @RequestParam(required = false) Ward wards,
            @RequestParam(required = false) BedStatus status,
            @RequestParam(required = false) Boolean hasVentilator,
            @RequestParam(required = false) String search )
    {
        return ResponseEntity.ok(bedService.getAllBeds(wards, status, hasVentilator, search));
    }


    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('TRIAGE', 'ICU_MANAGER', 'ADMIN')")
    public ResponseEntity<MetricsResponse> getMetrics(){
        return ResponseEntity.ok(bedService.getMetrics());
    }

    @PostMapping("/{id}/reserve")
    @PreAuthorize("hasAnyRole('TRIAGE', 'ADMIN')")
    public ResponseEntity<BedResponse> reserveBed(
            @PathVariable Long id,
            @Valid @RequestBody ReserveBedRequest request,
            Authentication authentication
    ){

        return ResponseEntity.ok(bedService.reserveBed(id, request, authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ICU_MANAGER', 'ADMIN')")
    public ResponseEntity<BedResponse> updateBedStatus(
        @PathVariable Long id,
        @Valid @RequestBody UpdateBedStatusRequest request,
        Authentication authentication
    ){
        return ResponseEntity.ok(bedService.updateBedStatus(id, request, authentication.getName()));
    }
}
