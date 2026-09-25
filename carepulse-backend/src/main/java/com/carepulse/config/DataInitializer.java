package com.carepulse.config;

import com.carepulse.entity.Bed;
import com.carepulse.entity.User;
import com.carepulse.enums.BedStatus;
import com.carepulse.enums.Role;
import com.carepulse.enums.Ward;
import com.carepulse.repository.BedRepository;
import com.carepulse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final BedRepository bedRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            seedUsers();
            seedBeds();
            log.info("CarePulse data initialization complete.");
        };
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            log.info("Users already seeded. Skipping...");
            return;
        }

        List<User> users = List.of(
                User.builder()
                        .username("admin")
                        .email("admin@carepulse.com")
                        .password(passwordEncoder.encode("admin123"))
                        .name("Dr. Sarah Chen")
                        .role(Role.ADMIN)
                        .build(),
                User.builder()
                        .username("icu_manager")
                        .email("icu@carepulse.com")
                        .password(passwordEncoder.encode("icu123"))
                        .name("James Rodriguez")
                        .role(Role.ICU_MANAGER)
                        .build(),
                User.builder()
                        .username("triage_nurse")
                        .email("triage@carepulse.com")
                        .password(passwordEncoder.encode("triage123"))
                        .name("Emily Watson")
                        .role(Role.ROLE_TRIAGE)
                        .build()
        );

        userRepository.saveAll(users);
        log.info("Seeded {} default users.", users.size());
    }

    private void seedBeds() {
        if (bedRepository.count() > 0) {
            log.info("Beds already seeded. Skipping...");
            return;
        }

        List<Bed> beds = List.of(
                // ICU Ward — Floor 1, Rooms 01-05
                Bed.builder().ward(Ward.ICU).floor(1).roomNumber(1).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(true).hasOxygen(true).build(),
                Bed.builder().ward(Ward.ICU).floor(1).roomNumber(2).bedRank("A")
                        .status(BedStatus.OCCUPIED).hasVentilator(true).hasOxygen(true).build(),
                Bed.builder().ward(Ward.ICU).floor(1).roomNumber(3).bedRank("A")
                        .status(BedStatus.RESERVED).hasVentilator(true).hasOxygen(false).build(),
                Bed.builder().ward(Ward.ICU).floor(1).roomNumber(4).bedRank("A")
                        .status(BedStatus.CLEANING).hasVentilator(false).hasOxygen(true).build(),
                Bed.builder().ward(Ward.ICU).floor(1).roomNumber(5).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(true).hasOxygen(true).build(),

                // General Ward — Floor 2, Rooms 01-04
                Bed.builder().ward(Ward.GENERAL).floor(2).roomNumber(1).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(false).hasOxygen(true).build(),
                Bed.builder().ward(Ward.GENERAL).floor(2).roomNumber(2).bedRank("A")
                        .status(BedStatus.OCCUPIED).hasVentilator(false).hasOxygen(false).build(),
                Bed.builder().ward(Ward.GENERAL).floor(2).roomNumber(3).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(false).hasOxygen(true).build(),
                Bed.builder().ward(Ward.GENERAL).floor(2).roomNumber(4).bedRank("A")
                        .status(BedStatus.CLEANING).hasVentilator(false).hasOxygen(false).build(),

                // Isolation Ward — Floor 3, Rooms 01-03
                Bed.builder().ward(Ward.ISOLATION).floor(3).roomNumber(1).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(true).hasOxygen(true).build(),
                Bed.builder().ward(Ward.ISOLATION).floor(3).roomNumber(2).bedRank("A")
                        .status(BedStatus.OCCUPIED).hasVentilator(false).hasOxygen(true).build(),
                Bed.builder().ward(Ward.ISOLATION).floor(3).roomNumber(3).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(true).hasOxygen(false).build(),

                // Pediatric Ward — Floor 4, Rooms 01-04
                Bed.builder().ward(Ward.PEDIATRIC).floor(4).roomNumber(1).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(false).hasOxygen(true).build(),
                Bed.builder().ward(Ward.PEDIATRIC).floor(4).roomNumber(2).bedRank("A")
                        .status(BedStatus.RESERVED).hasVentilator(false).hasOxygen(false).build(),
                Bed.builder().ward(Ward.PEDIATRIC).floor(4).roomNumber(3).bedRank("A")
                        .status(BedStatus.AVAILABLE).hasVentilator(false).hasOxygen(true).build(),
                Bed.builder().ward(Ward.PEDIATRIC).floor(4).roomNumber(4).bedRank("A")
                        .status(BedStatus.CLEANING).hasVentilator(false).hasOxygen(false).build()
        );

        bedRepository.saveAll(beds);
        log.info("Seeded {} initial beds.", beds.size());
    }
}