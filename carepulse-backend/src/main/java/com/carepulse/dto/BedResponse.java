package com.carepulse.dto;

import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Ward;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BedResponse {
    private Long id;
    private String bedNumber;
    private Ward ward;
    private BedStatus status;
    private Boolean hasVentilator;
    private Boolean hasOxygen;
    private PatientInfo currentPatient;
    private Integer version;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientInfo {
        private Long id;
        private String patientId;
        private String fullName;
        private Integer triageSeverity;
    }
}
