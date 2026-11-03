package com.urbanfix.backend.complaint;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.urbanfix.backend.auth.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ComplaintControllerTest {

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
    void testCreateComplaintAndTrackByNumber() throws Exception {
        String citizenToken = loginAndGetToken("citizen", "Citizen@123");

        CreateComplaintRequest request = new CreateComplaintRequest(
                "Water logging in Sector 5",
                "Monsoon water logging blocking entry gate to school.",
                "WATER_DRAINAGE",
                "HIGH",
                28.6200,
                77.2100,
                "School Road Sector 5",
                "https://example.com/water.jpg"
        );

        MvcResult createResult = mockMvc.perform(post("/api/complaints")
                        .header("Authorization", "Bearer " + citizenToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.trackingNumber").isNotEmpty())
                .andExpect(jsonPath("$.status").value("SUBMITTED"))
                .andReturn();

        String responseBody = createResult.getResponse().getContentAsString();
        Map<?, ?> responseMap = objectMapper.readValue(responseBody, Map.class);
        String trackingNumber = (String) responseMap.get("trackingNumber");
        Number complaintId = (Number) responseMap.get("id");

        // Public Tracking endpoint
        mockMvc.perform(get("/api/complaints/track/" + trackingNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.trackingNumber").value(trackingNumber))
                .andExpect(jsonPath("$.title").value("Water logging in Sector 5"));

        // Officer updates status to IN_PROGRESS
        String officerToken = loginAndGetToken("officer", "Officer@123");
        UpdateStatusRequest updateRequest = new UpdateStatusRequest("IN_PROGRESS", "Crew dispatched", null);

        mockMvc.perform(patch("/api/complaints/" + complaintId + "/status")
                        .header("Authorization", "Bearer " + officerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("IN_PROGRESS"));
    }

    @Test
    void testGetMyComplaintsRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/complaints/my"))
                .andExpect(status().isUnauthorized());

        String citizenToken = loginAndGetToken("citizen", "Citizen@123");
        mockMvc.perform(get("/api/complaints/my")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllComplaintsIsPublic() throws Exception {
        mockMvc.perform(get("/api/complaints"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
