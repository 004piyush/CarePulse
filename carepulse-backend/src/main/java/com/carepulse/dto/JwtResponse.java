package com.carepulse.dto;

import com.carepulse.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type;
    private Long id;
    private String username;
    private String email;
    private String name;
    private Role role;
}