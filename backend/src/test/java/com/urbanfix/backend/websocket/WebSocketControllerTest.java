package com.urbanfix.backend.websocket;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class WebSocketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetWebSocketInfo() throws Exception {
        mockMvc.perform(get("/api/ws/info"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.stompEndpoint").value("/ws"))
                .andExpect(jsonPath("$.rawEndpoint").value("/ws-raw"));
    }

    @Test
    void testBroadcastTestMessage() throws Exception {
        mockMvc.perform(post("/api/ws/broadcast-test")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\": \"Real-Time Socket Test\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.broadcastMessage").value("Real-Time Socket Test"));
    }
}

