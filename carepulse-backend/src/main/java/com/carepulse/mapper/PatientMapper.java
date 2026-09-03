package com.carepulse.mapper;

import com.carepulse.dto.BedResponse;
import com.carepulse.dto.ReserveBedRequest;
import com.carepulse.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PatientMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "admittedAt", ignore = true)
    Patient toEntity(ReserveBedRequest request);

    BedResponse.PatientInfo toPatientInfo(Patient patient);
}