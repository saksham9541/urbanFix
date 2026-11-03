package com.urbanfix.backend.analytics;

import com.urbanfix.backend.complaint.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping("/sla-summary")
    public ResponseEntity<Map<String, Object>> getSlaSummary() {
        return ResponseEntity.ok(complaintService.getSlaAnalytics());
    }
}
