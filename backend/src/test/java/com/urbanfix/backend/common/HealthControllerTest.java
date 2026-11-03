package com.urbanfix.backend.common;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthEndpointShouldBePublicAndReturnExpectedPayload() throws Exception {
        mockMvc.perform(get("/api/health").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("UrbanFix Backend"))
                .andExpect(jsonPath("$.version").value("1.0.0"));
    }

    @Test
    void protectedEndpointShouldRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/complaints/my").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}

