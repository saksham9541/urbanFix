package com.urbanfix.backend.assignment;

import com.urbanfix.backend.security.UserDetailsImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasAnyRole('OFFICER', 'ADMIN')")
public class OfficerController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> getOfficerDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of(
                "role", "ROLE_OFFICER",
                "message", "Welcome to Field Officer Dispatch Console",
                "user", userDetails.getUsername(),
                "permissions", List.of("VIEW_ASSIGNED_TICKETS", "UPDATE_TICKET_STATUS", "UPLOAD_RESOLUTION_PROOF"),
                "assignedTasksCount", 5,
                "slaWarnings", 1
        ));
    }
}
