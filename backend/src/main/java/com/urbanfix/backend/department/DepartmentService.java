package com.urbanfix.backend.department;

import com.urbanfix.backend.complaint.Complaint;
import com.urbanfix.backend.complaint.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public List<DepartmentResponse> getAllDepartments() {
        List<Department> departments = departmentRepository.findByIsActiveTrue();
        List<Complaint> allComplaints = complaintRepository.findAll();

        return departments.stream().map(dept -> {
            long active = allComplaints.stream()
                    .filter(c -> c.getDepartment() != null && c.getDepartment().getId().equals(dept.getId()))
                    .filter(c -> !"RESOLVED".equalsIgnoreCase(c.getStatus()) && !"CLOSED".equalsIgnoreCase(c.getStatus()))
                    .count();

            long resolved = allComplaints.stream()
                    .filter(c -> c.getDepartment() != null && c.getDepartment().getId().equals(dept.getId()))
                    .filter(c -> "RESOLVED".equalsIgnoreCase(c.getStatus()) || "CLOSED".equalsIgnoreCase(c.getStatus()))
                    .count();

            return new DepartmentResponse(
                    dept.getId(),
                    dept.getName(),
                    dept.getCode(),
                    dept.getDescription(),
                    dept.getContactEmail(),
                    dept.getDefaultSlaHours(),
                    active,
                    resolved
            );
        }).collect(Collectors.toList());
    }

    public Department getDepartmentByCode(String code) {
        return departmentRepository.findByCode(code.toUpperCase())
                .orElseThrow(() -> new RuntimeException("Department not found with code: " + code));
    }

    public Department resolveDepartmentForCategory(String category) {
        if (category == null) {
            return departmentRepository.findByCode("ROADS").orElse(null);
        }

        String cat = category.toUpperCase();
        String code = "ROADS";

        if (cat.contains("GARBAGE") || cat.contains("SANITATION") || cat.contains("WASTE") || cat.contains("HEALTH")) {
            code = "SANITATION";
        } else if (cat.contains("STREETLIGHT") || cat.contains("ELECTRIC") || cat.contains("POWER")) {
            code = "ELECTRICITY";
        } else if (cat.contains("WATER") || cat.contains("DRAIN") || cat.contains("SEWAGE")) {
            code = "WATER";
        } else if (cat.contains("PARK") || cat.contains("GARDEN") || cat.contains("TREE")) {
            code = "PARKS";
        } else if (cat.contains("ROAD") || cat.contains("POTHOLE") || cat.contains("PAVEMENT") || cat.contains("TRAFFIC")) {
            code = "ROADS";
        }

        final String targetCode = code;
        return departmentRepository.findByCode(targetCode)
                .orElseGet(() -> departmentRepository.findAll().stream().findFirst().orElse(null));
    }
}
