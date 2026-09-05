package com.carepulse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", unique = true, nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private Integer triageSeverity;

    @Column(nullable = false)
    private LocalDateTime admittedAt;

    @Column(name = "bed_number")
    private String bedNumber;

    @Column(name = "room_number")
    private String roomNumber;
}