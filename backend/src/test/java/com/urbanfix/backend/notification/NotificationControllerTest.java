package com.urbanfix.backend.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbanfix.backend.auth.LoginRequest;
import com.urbanfix.backend.complaint.RateResolutionRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken(String username, String password) throws Exception {
        LoginRequest loginRequest = new LoginRequest(username, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Map<?, ?> responseMap = objectMapper.readValue(responseBody, Map.class);
        return (String) responseMap.get("token");
    }

    @Test
    void testGetNotificationsAndUnreadCount() throws Exception {
        String citizenToken = loginAndGetToken("citizen", "Citizen@123");

        mockMvc.perform(get("/api/notifications")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        mockMvc.perform(get("/api/notifications/unread-count")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").isNumber());
    }

    @Test
    void testRateResolvedComplaint() throws Exception {
        String citizenToken = loginAndGetToken("citizen", "Citizen@123");

        RateResolutionRequest rateRequest = new RateResolutionRequest(5, "High quality pothole repair and cleanup!");

        mockMvc.perform(post("/api/complaints/3/rate")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CLOSED"))
                .andExpect(jsonPath("$.citizenRating").value(5))
                .andExpect(jsonPath("$.citizenFeedback").value("High quality pothole repair and cleanup!"));
    }
}

