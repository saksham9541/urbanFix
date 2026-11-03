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
    private com.urbanfix.backend.department.DepartmentRepository departmentRepository;

    @Autowired
    private com.urbanfix.backend.complaint.ComplaintRepository complaintRepository;

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

        // 2. Seed Municipal Departments
        if (departmentRepository.count() == 0) {
            departmentRepository.save(new com.urbanfix.backend.department.Department(
                    "Public Works & Roads", "ROADS",
                    "Road maintenance, pothole repairs, bridges, footpaths and pedestrian crossings",
                    "roads@urbanfix.gov", 24));

            departmentRepository.save(new com.urbanfix.backend.department.Department(
                    "Public Health & Sanitation", "SANITATION",
                    "Municipal solid waste management, dumpster clearing, street sweeping, and hygiene",
                    "sanitation@urbanfix.gov", 12));

            departmentRepository.save(new com.urbanfix.backend.department.Department(
                    "Power & Streetlights", "ELECTRICITY",
                    "Public lighting fixtures, dark spots, electrical poles, and wiring faults",
                    "power@urbanfix.gov", 24));

            departmentRepository.save(new com.urbanfix.backend.department.Department(
                    "Water Supply & Drainage", "WATER",
                    "Pipeline leakages, sewage overflow, contaminated water, stormwater drains",
                    "water@urbanfix.gov", 18));

            departmentRepository.save(new com.urbanfix.backend.department.Department(
                    "Horticulture & Urban Forestry", "PARKS",
                    "Public parks, overgrown trees, fallen branches, playground equipment",
                    "parks@urbanfix.gov", 48));

            log.info("Seeded 5 core municipal departments with SLA thresholds.");
        }

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

        // 5. Seed Initial Sample Complaints for Live Demo
        if (complaintRepository.count() == 0) {
            User demoCitizen = userRepository.findByUsername("citizen").orElse(null);
            User demoOfficer = userRepository.findByUsername("officer").orElse(null);

            com.urbanfix.backend.department.Department roadsDept = departmentRepository.findByCode("ROADS").orElse(null);
            com.urbanfix.backend.department.Department sanitationDept = departmentRepository.findByCode("SANITATION").orElse(null);
            com.urbanfix.backend.department.Department electricDept = departmentRepository.findByCode("ELECTRICITY").orElse(null);

            com.urbanfix.backend.complaint.Complaint c1 = new com.urbanfix.backend.complaint.Complaint(
                    "UF-2026-10001",
                    "Deep Pothole on Outer Ring Road",
                    "A dangerous pothole near the highway exit causing severe traffic slowing and vehicle damage.",
                    "ROADS_INFRASTRUCTURE",
                    "HIGH",
                    28.6315,
                    77.2167,
                    "Outer Ring Road, Near Junction 4",
                    "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
                    demoCitizen
            );
            c1.setStatus("IN_PROGRESS");
            c1.setAssignedOfficer(demoOfficer);
            c1.setDepartment(roadsDept);
            c1.setSlaDeadline(Instant.now().plus(12, java.time.temporal.ChronoUnit.HOURS));
            c1.setAiConfidence(0.96);
            c1.setAiPredictedCategory("ROADS_INFRASTRUCTURE");
            complaintRepository.save(c1);

            com.urbanfix.backend.complaint.Complaint c2 = new com.urbanfix.backend.complaint.Complaint(
                    "UF-2026-10002",
                    "Overflowing Garbage Dumpster at Green Park",
                    "Municipal waste bin has not been cleared for 4 days, causing foul smell and health hazard.",
                    "GARBAGE_SANITATION",
                    "MEDIUM",
                    28.6180,
                    77.2050,
                    "Sector 4 Civic Park Gate B",
                    "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80",
                    demoCitizen
            );
            c2.setStatus("SUBMITTED");
            c2.setDepartment(sanitationDept);
            c2.setSlaDeadline(Instant.now().plus(12, java.time.temporal.ChronoUnit.HOURS));
            c2.setAiConfidence(0.92);
            c2.setAiPredictedCategory("GARBAGE_SANITATION");
            complaintRepository.save(c2);

            com.urbanfix.backend.complaint.Complaint c3 = new com.urbanfix.backend.complaint.Complaint(
                    "UF-2026-10003",
                    "Broken High-Mast Streetlight",
                    "Streetlight fixture short-circuited and pole lamp is dark at night near pedestrian crossing.",
                    "STREETLIGHT_ELECTRICITY",
                    "LOW",
                    28.6250,
                    77.2210,
                    "Barakhamba Road Pole 12",
                    null,
                    demoCitizen
            );
            c3.setStatus("RESOLVED");
            c3.setAssignedOfficer(demoOfficer);
            c3.setDepartment(electricDept);
            c3.setSlaDeadline(Instant.now().plus(24, java.time.temporal.ChronoUnit.HOURS));
            c3.setResolvedAt(Instant.now());
            c3.setIsSlaBreached(false);
            c3.setResolutionNotes("LED bulb unit and junction fuse replaced by field crew.");
            c3.setAiConfidence(0.89);
            c3.setAiPredictedCategory("STREETLIGHT_ELECTRICITY");
            complaintRepository.save(c3);

            log.info("Seeded 3 demo civic complaints with departments and SLA deadlines.");
        }
    }
}

