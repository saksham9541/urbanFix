package com.urbanfix.backend.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
public class WebSocketController {

    @Autowired
    private WebSocketEventPublisher eventPublisher;

    @MessageMapping("/ping")
    @SendTo("/topic/system")
    public Map<String, Object> handlePingMessage(Map<String, Object> message) {
        return Map.of(
                "type", "PONG",
                "received", message,
                "serverTime", Instant.now().toString()
        );
    }

    @GetMapping("/api/ws/info")
    public ResponseEntity<Map<String, Object>> getWebSocketInfo() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "stompEndpoint", "/ws",
                "rawEndpoint", "/ws-raw",
                "topics", new String[]{
                        "/topic/complaints",
                        "/topic/notifications/{userId}",
                        "/topic/system"
                }
        ));
    }

    @PostMapping("/api/ws/broadcast-test")
    public ResponseEntity<Map<String, Object>> broadcastTestMessage(@RequestBody(required = false) Map<String, String> body) {
        String message = body != null && body.containsKey("message") ? body.get("message") : "UrbanFix Live Socket Broadcast Test";
        eventPublisher.publishTestEvent(message);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "broadcastMessage", message));
    }
}

