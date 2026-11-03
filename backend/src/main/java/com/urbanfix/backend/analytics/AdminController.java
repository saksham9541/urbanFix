package com.urbanfix.backend.analytics;

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
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of(
                "role", "ROLE_ADMIN",
                "message", "Welcome to UrbanFix Central Administration Console",
                "user", userDetails.getUsername(),
                "permissions", List.of("SYSTEM_SETTINGS", "MANAGE_DEPARTMENTS", "MANAGE_OFFICERS", "VIEW_HEATMAPS", "EXPORT_AUDIT_LOGS"),
                "totalUsers", 42,
                "totalComplaints", 128,
                "departmentsCount", 6
        ));
    }
}
