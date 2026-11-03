package com.urbanfix.backend.complaint;

import com.urbanfix.backend.department.Department;
import com.urbanfix.backend.department.DepartmentService;
import com.urbanfix.backend.user.User;
import com.urbanfix.backend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private UserRepository userRepository;

    private static final Random RANDOM = new Random();

    private synchronized String generateUniqueTrackingNumber() {
        int year = Year.now().getValue();
        String candidate;
        do {
            int randomPart = 10000 + RANDOM.nextInt(90000);
            candidate = String.format("UF-%d-%d", year, randomPart);
        } while (complaintRepository.findByTrackingNumber(candidate).isPresent());
        return candidate;
    }

    @Transactional
    public ComplaintResponse createComplaint(CreateComplaintRequest request, User citizen) {
        String trackingNumber = generateUniqueTrackingNumber();

        Complaint complaint = new Complaint(
                trackingNumber,
                request.getTitle(),
                request.getDescription(),
                request.getCategory(),
                request.getSeverity(),
                request.getLatitude(),
                request.getLongitude(),
                request.getAddress(),
                request.getImageUrl(),
                citizen
        );

        // 1. Automated Department Routing based on Issue Category
        Department dept = departmentService.resolveDepartmentForCategory(request.getCategory());
        if (dept != null) {
            complaint.setDepartment(dept);

            // 2. Intelligent SLA Engine calculation
            int slaHours = dept.getDefaultSlaHours() != null ? dept.getDefaultSlaHours() : 24;
            String sev = request.getSeverity() != null ? request.getSeverity().toUpperCase() : "MEDIUM";

            if ("CRITICAL".equals(sev)) {
                slaHours = Math.max(4, slaHours / 2); // 50% SLA duration for critical hazards
            } else if ("HIGH".equals(sev)) {
                slaHours = Math.max(8, (int) (slaHours * 0.75));
            } else if ("LOW".equals(sev)) {
                slaHours = (int) (slaHours * 1.25);
            }

            Instant deadline = Instant.now().plus(slaHours, ChronoUnit.HOURS);
            complaint.setSlaDeadline(deadline);
        } else {
            complaint.setSlaDeadline(Instant.now().plus(24, ChronoUnit.HOURS));
        }

        complaint.setStatus(ComplaintStatus.SUBMITTED.name());
        complaint.setCreatedAt(Instant.now());
        complaint.setUpdatedAt(Instant.now());

        Complaint saved = complaintRepository.save(complaint);
        return ComplaintResponse.fromEntity(saved);
    }

    public ComplaintResponse getByTrackingNumber(String trackingNumber) {
        Complaint complaint = complaintRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Complaint not found with tracking number: " + trackingNumber));
        return ComplaintResponse.fromEntity(complaint);
    }

    public List<ComplaintResponse> getComplaintsByCitizen(Long citizenId) {
        return complaintRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                .stream()
                .map(ComplaintResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getTicketsForOfficer(Long officerId) {
        return complaintRepository.findByAssignedOfficerIdOrderByCreatedAtDesc(officerId)
                .stream()
                .map(ComplaintResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAllComplaints(String status, String category) {
        List<Complaint> list;
        if (status != null && !status.isBlank()) {
            list = complaintRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase());
        } else if (category != null && !category.isBlank()) {
            list = complaintRepository.findByCategoryOrderByCreatedAtDesc(category.toUpperCase());
        } else {
            list = complaintRepository.findAllByOrderByCreatedAtDesc();
        }

        return list.stream()
                .map(ComplaintResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ComplaintResponse assignComplaint(Long id, Long officerId, Long departmentId) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

        if (officerId != null) {
            User officer = userRepository.findById(officerId)
                    .orElseThrow(() -> new RuntimeException("Officer not found with id: " + officerId));
            complaint.setAssignedOfficer(officer);
            complaint.setStatus(ComplaintStatus.ASSIGNED.name());
        }

        if (departmentId != null) {
            // update department if re-assigned
            com.urbanfix.backend.department.Department dept = departmentService.getAllDepartments().stream()
                    .filter(d -> d.getId().equals(departmentId))
                    .map(d -> departmentService.getDepartmentByCode(d.getCode()))
                    .findFirst()
                    .orElse(null);
            if (dept != null) {
                complaint.setDepartment(dept);
            }
        }

        complaint.setUpdatedAt(Instant.now());
        Complaint saved = complaintRepository.save(complaint);
        return ComplaintResponse.fromEntity(saved);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long id, UpdateStatusRequest request, User officerOrAdmin) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

        complaint.setStatus(request.getStatus().toUpperCase());
        complaint.setUpdatedAt(Instant.now());

        if (request.getResolutionNotes() != null) {
            complaint.setResolutionNotes(request.getResolutionNotes());
        }

        if (request.getResolutionImageUrl() != null) {
            complaint.setResolutionImageUrl(request.getResolutionImageUrl());
        }

        if ("RESOLVED".equalsIgnoreCase(request.getStatus()) || "CLOSED".equalsIgnoreCase(request.getStatus())) {
            complaint.setResolvedAt(Instant.now());
            if (complaint.getSlaDeadline() != null) {
                complaint.setIsSlaBreached(Instant.now().isAfter(complaint.getSlaDeadline()));
            }
        }

        if (complaint.getAssignedOfficer() == null && officerOrAdmin != null) {
            complaint.setAssignedOfficer(officerOrAdmin);
        }

        Complaint saved = complaintRepository.save(complaint);
        return ComplaintResponse.fromEntity(saved);
    }

    public Map<String, Object> getSlaAnalytics() {
        List<Complaint> all = complaintRepository.findAll();
        long total = all.size();
        long resolved = all.stream().filter(c -> "RESOLVED".equalsIgnoreCase(c.getStatus()) || "CLOSED".equalsIgnoreCase(c.getStatus())).count();
        long active = total - resolved;

        long breached = all.stream()
                .filter(c -> {
                    if (Boolean.TRUE.equals(c.getIsSlaBreached())) return true;
                    if (c.getSlaDeadline() != null && !"RESOLVED".equalsIgnoreCase(c.getStatus()) && !"CLOSED".equalsIgnoreCase(c.getStatus())) {
                        return Instant.now().isAfter(c.getSlaDeadline());
                    }
                    return false;
                }).count();

        double complianceRate = total > 0 ? ((double) (total - breached) / total) * 100.0 : 100.0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTickets", total);
        stats.put("activeTickets", active);
        stats.put("resolvedTickets", resolved);
        stats.put("breachedTickets", breached);
        stats.put("slaCompliancePercentage", Math.round(complianceRate * 10.0) / 10.0);
        return stats;
    }
}


