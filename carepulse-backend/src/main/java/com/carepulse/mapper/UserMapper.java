package com.carepulse.mapper;

import com.carepulse.dto.JwtResponse;
import com.carepulse.dto.RegisterRequest;
import com.carepulse.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Entity to DTO mapping
    @Mapping(target = "token", source = "token")
    @Mapping(target = "type", constant = "Bearer")
    JwtResponse toJwtResponse(User user, String token);

    // DTO to entity mapping
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequest request);
}
