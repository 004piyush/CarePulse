package com.carepulse.repository;

import com.carepulse.entity.Bed;
import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    Optional<Bed> findByBedNumber(String bedNumber);
    boolean existsByBedNumber(String bedNumber);

    List<Bed> findByStatus(BedStatus status);
    List<Bed> findByWard(Ward ward);
    List<Bed> findByWardAndStatus(Ward ward, BedStatus status);
    List<Bed> findByHasVentilatorTrue();

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.ward = 'ICU'")
    long countIcuBeds();

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.ward = 'ICU' AND b.status = 'AVAILABLE'")
    long countAvailableIcuBeds();

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.hasVentilator = true AND b.status = 'OCCUPIED'")
    long countActiveVentilators();

    @Query("SELECT COUNT(b) FROM Bed b WHERE b.status = 'CLEANING'")
    long countCleaningBeds();
}
