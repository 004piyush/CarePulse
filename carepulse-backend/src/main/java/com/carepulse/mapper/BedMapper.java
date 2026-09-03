package com.carepulse.mapper;

import com.carepulse.dto.BedResponse;
import com.carepulse.entity.Bed;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = PatientMapper.class)
public interface BedMapper {

    @Mapping(target = "currentPatient", source = "currentPatient")
    BedResponse toResponse(Bed bed);
}