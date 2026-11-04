package com.urbanfix.backend.websocket;

import com.urbanfix.backend.complaint.ComplaintResponse;
import com.urbanfix.backend.notification.NotificationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(WebSocketEventPublisher.class);

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    public void publishComplaintCreated(ComplaintResponse complaint) {
        if (messagingTemplate == null) return;
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "COMPLAINT_CREATED");
            payload.put("action", "NEW_INCIDENT");
            payload.put("timestamp", Instant.now().toString());
            payload.put("data", complaint);

            messagingTemplate.convertAndSend("/topic/complaints", payload);
            log.info("WebSocket broadcast sent: COMPLAINT_CREATED [{}]", complaint.getTrackingNumber());
        } catch (Exception e) {
            log.warn("Failed to broadcast WebSocket message COMPLAINT_CREATED: {}", e.getMessage());
        }
    }

    public void publishComplaintUpdated(ComplaintResponse complaint, String action) {
        if (messagingTemplate == null) return;
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "COMPLAINT_UPDATED");
            payload.put("action", action);
            payload.put("timestamp", Instant.now().toString());
            payload.put("data", complaint);

            messagingTemplate.convertAndSend("/topic/complaints", payload);
            log.info("WebSocket broadcast sent: COMPLAINT_UPDATED [{}] action={}", complaint.getTrackingNumber(), action);
        } catch (Exception e) {
            log.warn("Failed to broadcast WebSocket message COMPLAINT_UPDATED: {}", e.getMessage());
        }
    }

    public void publishNotification(Long userId, NotificationResponse notification) {
        if (messagingTemplate == null || userId == null) return;
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("type", "NEW_NOTIFICATION");
            payload.put("userId", userId);
            payload.put("timestamp", Instant.now().toString());
            payload.put("data", notification);

            // Publish to user-specific topic
            messagingTemplate.convertAndSend("/topic/notifications/" + userId, payload);
            log.info("WebSocket notification pushed to user {} for [{}]", userId, notification.getTitle());
        } catch (Exception e) {
            log.warn("Failed to push WebSocket notification to user {}: {}", userId, e.getMessage());
        }
    }

    public void publishTestEvent(String message) {
        if (messagingTemplate == null) return;
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "SYSTEM_PING");
        payload.put("message", message);
        payload.put("timestamp", Instant.now().toString());
        messagingTemplate.convertAndSend("/topic/system", payload);
    }
}

