package com.urbanfix.backend.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiVisionService aiVisionService;

    @PostMapping("/analyze")
    public ResponseEntity<AiAnalysisResponseDto> analyzeIssue(@RequestBody AiAnalysisRequestDto request) {
        AiAnalysisResponseDto response = aiVisionService.analyzeIssue(
                request.getImageUrl(),
                request.getTitle(),
                request.getDescription(),
                request.getCategoryHint()
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkAiHealth() {
        boolean healthy = aiVisionService.isAiServiceHealthy();
        return ResponseEntity.ok(Map.of(
                "status", healthy ? "UP" : "DEGRADED",
                "aiService", "FastAPI Vision Engine",
                "endpoint", "http://localhost:8000"
        ));
    }
}
