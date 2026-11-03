package com.urbanfix.backend.complaint;

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
@RequestMapping("/api/citizen")
@PreAuthorize("hasAnyRole('CITIZEN', 'ADMIN')")
public class CitizenController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> getCitizenDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of(
                "role", "ROLE_CITIZEN",
                "message", "Welcome to Citizen Civic Portal",
                "user", userDetails.getUsername(),
                "permissions", List.of("REPORT_ISSUE", "VIEW_OWN_COMPLAINTS", "RATE_RESOLUTION"),
                "activeComplaintsCount", 2
        ));
    }
}

