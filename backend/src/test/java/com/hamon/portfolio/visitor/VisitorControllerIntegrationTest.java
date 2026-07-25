package com.hamon.portfolio.visitor;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class VisitorControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    VisitorRepository visitorRepository;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        visitorRepository.deleteAll();
    }

    @Test
    @DisplayName("POST /api/visitors - 방문자 기록 성공")
    void record_newVisitor_returns200() throws Exception {
        Map<String, String> body = Map.of("path", "HOME");

        mockMvc.perform(post("/api/visitors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(visitorRepository.count()).isEqualTo(1L);
    }

    @Test
    @DisplayName("POST /api/visitors - 같은 경로 중복 요청은 1회만 저장")
    void record_duplicatePath_saveOnce() throws Exception {
        Map<String, String> body = Map.of("path", "BLOG");

        mockMvc.perform(post("/api/visitors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)));

        mockMvc.perform(post("/api/visitors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)));

        assertThat(visitorRepository.count()).isEqualTo(1L);
    }

    @Test
    @DisplayName("POST /api/visitors - 잘못된 path 값 시 400")
    void record_invalidPath_returns400() throws Exception {
        Map<String, String> body = Map.of("path", "INVALID_PATH");

        mockMvc.perform(post("/api/visitors")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/visitors/stats - 통계 구조 반환")
    void stats_returnsCorrectStructure() throws Exception {
        mockMvc.perform(get("/api/visitors/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.total").isNumber())
                .andExpect(jsonPath("$.data.today").isNumber())
                .andExpect(jsonPath("$.data.byPath").exists());
    }

    @Test
    @DisplayName("GET /api/visitors/stats - 방문자 기록 후 통계 반영")
    void stats_afterRecord_countIncremented() throws Exception {
        Map<String, String> body = Map.of("path", "HOME");
        mockMvc.perform(post("/api/visitors")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)));

        mockMvc.perform(get("/api/visitors/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.today").value(1))
                .andExpect(jsonPath("$.data.byPath.HOME").value(1));
    }
}
