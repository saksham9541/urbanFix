package com.urbanfix.backend.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

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
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        Map<?, ?> responseMap = objectMapper.readValue(responseBody, Map.class);
        return (String) responseMap.get("token");
    }

    @Test
    void testCitizenLoginAndRoleAuthorization() throws Exception {
        String citizenToken = loginAndGetToken("citizen", "Citizen@123");

        // Citizen can access citizen dashboard
        mockMvc.perform(get("/api/citizen/dashboard")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ROLE_CITIZEN"));

        // Citizen CANNOT access admin dashboard (403 Forbidden)
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + citizenToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testOfficerLoginAndRoleAuthorization() throws Exception {
        String officerToken = loginAndGetToken("officer", "Officer@123");

        // Officer can access officer dashboard
        mockMvc.perform(get("/api/officer/dashboard")
                        .header("Authorization", "Bearer " + officerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ROLE_OFFICER"));

        // Officer CANNOT access admin dashboard (403 Forbidden)
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + officerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void testAdminLoginAndFullAuthorization() throws Exception {
        String adminToken = loginAndGetToken("admin", "Admin@123");

        // Admin can access admin dashboard
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));

        // Admin can also access officer & citizen endpoints
        mockMvc.perform(get("/api/officer/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/citizen/dashboard")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    void testRegistrationForNewUser() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "newcitizen",
                "newcitizen@urbanfix.com",
                "NewPass@123",
                "CITIZEN"
        );
        registerRequest.setFirstName("Jane");
        registerRequest.setLastName("Doe");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.roles[0]").value("ROLE_CITIZEN"));
    }

    @Test
    void testUnauthenticatedAccessRejected() throws Exception {
        mockMvc.perform(get("/api/citizen/dashboard"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/officer/dashboard"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isUnauthorized());
    }
}

