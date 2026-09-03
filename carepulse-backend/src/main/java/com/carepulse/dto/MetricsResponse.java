package com.carepulse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MetricsResponse {
    private long totalIcuBeds;
    private long availableIcuBeds;
    private long activeVentilators;
    private long cleaningBeds;
}
