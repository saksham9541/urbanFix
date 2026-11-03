package com.urbanfix.backend.complaint;

import com.urbanfix.backend.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.Year;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

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
        }

        if (complaint.getAssignedOfficer() == null && officerOrAdmin != null) {
            complaint.setAssignedOfficer(officerOrAdmin);
        }

        Complaint saved = complaintRepository.save(complaint);
        return ComplaintResponse.fromEntity(saved);
    }
}
