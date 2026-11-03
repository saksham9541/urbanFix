package com.urbanfix.backend.common;

import com.urbanfix.backend.user.Role;
import com.urbanfix.backend.user.RoleName;
import com.urbanfix.backend.user.RoleRepository;
import com.urbanfix.backend.user.User;
import com.urbanfix.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Ensure all 3 roles exist
        Role citizenRole = roleRepository.findByName(RoleName.ROLE_CITIZEN.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_CITIZEN.name(), "Regular citizen reporting issues")));

        Role officerRole = roleRepository.findByName(RoleName.ROLE_OFFICER.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_OFFICER.name(), "Department field officer resolving complaints")));

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN.name())
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_ADMIN.name(), "System administrator with full access")));

        // 2. Seed Citizen Demo User
        if (!userRepository.existsByUsername("citizen")) {
            User citizen = new User("citizen", "citizen@urbanfix.com", passwordEncoder.encode("Citizen@123"), "John", "Citizen");
            citizen.setRoles(Set.of(citizenRole));
            citizen.setPhoneNumber("+1-555-0101");
            citizen.setIsActive(true);
            citizen.setCreatedAt(Instant.now());
            userRepository.save(citizen);
            log.info("Seeded demo Citizen user: citizen@urbanfix.com / Citizen@123");
        }

        // 3. Seed Officer Demo User
        if (!userRepository.existsByUsername("officer")) {
            User officer = new User("officer", "officer@urbanfix.com", passwordEncoder.encode("Officer@123"), "Sarah", "Inspector");
            officer.setRoles(Set.of(officerRole));
            officer.setPhoneNumber("+1-555-0102");
            officer.setIsActive(true);
            officer.setCreatedAt(Instant.now());
            userRepository.save(officer);
            log.info("Seeded demo Officer user: officer@urbanfix.com / Officer@123");
        }

        // 4. Seed Admin Demo User
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", "admin@urbanfix.com", passwordEncoder.encode("Admin@123"), "Alex", "Administrator");
            admin.setRoles(Set.of(adminRole));
            admin.setPhoneNumber("+1-555-0100");
            admin.setIsActive(true);
            admin.setCreatedAt(Instant.now());
            userRepository.save(admin);
            log.info("Seeded demo Admin user: admin@urbanfix.com / Admin@123");
        }
    }
}
