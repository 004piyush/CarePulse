package com.carepulse.entity;


import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Ward;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "beds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Constructed as: ICU-101-A
    @Column(name = "bed_number", unique = true, nullable = false, length = 30)
    private String bedNumber;

    @Transient
    private Integer floor; // e.g., 1, 2, 3

    @Transient
    private Integer roomNumber; // e.g., 1 (formatted to 01)

    @Transient
    private String bedRank; // e.g., "A", "B", "C"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Ward ward; // ICU, GENERAL, ISOLATION, PEDIATRIC

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedStatus status;

    @Column(nullable = false)
    private Boolean hasVentilator;

    @Column(nullable = false)
    private Boolean hasOxygen;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "current_patient_id", referencedColumnName = "id")
    private Patient currentPatient;

    @Version
    private Integer version;

    @PrePersist
    @PreUpdate
    public void assembleBedNumber() {
        if (this.ward != null && this.floor != null && this.roomNumber != null && this.bedRank != null) {
            // Produces: ICU-101-A
            this.bedNumber = String.format("%s-%d%02d-%s",
                    this.ward.name(),
                    this.floor,
                    this.roomNumber,
                    this.bedRank.toUpperCase().trim()
            );
        }
    }

}
