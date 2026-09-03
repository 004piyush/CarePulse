package com.carepulse.dto;

import com.carepulse.enums.BedStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateBedStatusRequest {
    @NotNull(message = "New status is required")
    private BedStatus newStatus;
}
