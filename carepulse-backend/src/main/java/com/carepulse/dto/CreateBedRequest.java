package com.carepulse.dto;

import com.carepulse.enums.Ward;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBedRequest {

    @NotNull(message = "Ward is required")
    private Ward ward;

    @NotNull(message = "Floor is required")
    private Integer floor;

    @NotNull(message = "Room number is required")
    private Integer roomNumber;

    @NotBlank(message = "Bed rank is required")
    private String bedRank;

    @NotNull(message = "Ventilator flag is required")
    private Boolean hasVentilator;

    @NotNull(message = "Oxygen flag is required")
    private Boolean hasOxygen;
}
