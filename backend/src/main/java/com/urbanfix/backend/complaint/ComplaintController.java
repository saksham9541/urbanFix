package com.urbanfix.backend.complaint;

import com.urbanfix.backend.security.UserDetailsImpl;
import com.urbanfix.backend.user.User;
import com.urbanfix.backend.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('CITIZEN', 'ADMIN')")
    public ResponseEntity<ComplaintResponse> createComplaint(
            @Valid @RequestBody CreateComplaintRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User citizen = null;
        if (userDetails != null) {
            citizen = userRepository.findById(userDetails.getId()).orElse(null);
        }

        ComplaintResponse response = complaintService.createComplaint(request, citizen);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('CITIZEN', 'ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ComplaintResponse> complaints = complaintService.getComplaintsByCitizen(userDetails.getId());
        return ResponseEntity.ok(complaints);
    }

    @GetMapping("/officer/tickets")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getOfficerTickets(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<ComplaintResponse> complaints = complaintService.getTicketsForOfficer(userDetails.getId());
        return ResponseEntity.ok(complaints);
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'OFFICER')")
    public ResponseEntity<ComplaintResponse> assignComplaint(
            @PathVariable Long id,
            @RequestParam(required = false) Long officerId,
            @RequestParam(required = false) Long departmentId) {
        ComplaintResponse assigned = complaintService.assignComplaint(id, officerId, departmentId);
        return ResponseEntity.ok(assigned);
    }

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<ComplaintResponse> trackComplaint(@PathVariable String trackingNumber) {
        ComplaintResponse complaint = complaintService.getByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(complaint);
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category) {
        List<ComplaintResponse> complaints = complaintService.getAllComplaints(status, category);
        return ResponseEntity.ok(complaints);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User officerOrAdmin = null;
        if (userDetails != null) {
            officerOrAdmin = userRepository.findById(userDetails.getId()).orElse(null);
        }

        ComplaintResponse updated = complaintService.updateStatus(id, request, officerOrAdmin);
        return ResponseEntity.ok(updated);
    }
}

