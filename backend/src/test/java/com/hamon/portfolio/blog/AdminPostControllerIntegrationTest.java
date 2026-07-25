package com.hamon.portfolio.blog;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hamon.portfolio.auth.JwtProvider;
import com.hamon.portfolio.blog.dto.PostRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminPostControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    PostRepository postRepository;

    @Autowired
    JwtProvider jwtProvider;

    @Autowired
    ObjectMapper objectMapper;

    private String adminToken;

    @BeforeEach
    void setUp() {
        postRepository.deleteAll();
        adminToken = "Bearer " + jwtProvider.generateToken("admin");
    }

    private PostRequest buildRequest(String slug) {
        return new PostRequest(slug, "테스트 제목", "본문 내용",
                LocalDate.of(2026, 7, 25), null,
                List.of(new PostRequest.TagInfo("MongoDB", TagType.GENERAL)));
    }

    @Test
    @DisplayName("POST /api/admin/posts - JWT 있을 때 포스트 생성 성공")
    void create_withJwt_returns201() throws Exception {
        mockMvc.perform(post("/api/admin/posts")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest("new-post"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("new-post"))
                .andExpect(jsonPath("$.data.title").value("테스트 제목"));

        assertThat(postRepository.existsBySlug("new-post")).isTrue();
    }

    @Test
    @DisplayName("POST /api/admin/posts - slug 중복 시 400")
    void create_duplicateSlug_returns400() throws Exception {
        postRepository.save(Post.builder()
                .slug("existing")
                .title("기존 포스트")
                .date(LocalDate.now())
                .tags(List.of())
                .build());

        mockMvc.perform(post("/api/admin/posts")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest("existing"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("PUT /api/admin/posts/{id} - 포스트 수정 성공")
    void update_withJwt_returns200() throws Exception {
        Post saved = postRepository.save(Post.builder()
                .slug("update-me")
                .title("원래 제목")
                .date(LocalDate.now())
                .tags(List.of())
                .build());

        PostRequest updateRequest = new PostRequest("update-me", "수정된 제목", "수정된 내용",
                LocalDate.of(2026, 7, 25), null, List.of());

        mockMvc.perform(put("/api/admin/posts/" + saved.getId())
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.title").value("수정된 제목"));
    }

    @Test
    @DisplayName("DELETE /api/admin/posts/{id} - 포스트 삭제 성공")
    void delete_withJwt_returns200() throws Exception {
        Post saved = postRepository.save(Post.builder()
                .slug("delete-me")
                .title("삭제될 포스트")
                .date(LocalDate.now())
                .tags(List.of())
                .build());

        mockMvc.perform(delete("/api/admin/posts/" + saved.getId())
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        assertThat(postRepository.existsById(saved.getId())).isFalse();
    }

    @Test
    @DisplayName("DELETE /api/admin/posts/{id} - 존재하지 않는 id 삭제 시 404")
    void delete_notFound_returns404() throws Exception {
        mockMvc.perform(delete("/api/admin/posts/nonexistent-id")
                        .header("Authorization", adminToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("POST /api/admin/posts - 만료된/잘못된 JWT 시 401/403")
    void create_invalidJwt_returnsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/admin/posts")
                        .header("Authorization", "Bearer invalid.jwt.token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRequest("any-slug"))))
                .andExpect(status().is(org.hamcrest.Matchers.either(
                        org.hamcrest.Matchers.is(401)).or(org.hamcrest.Matchers.is(403))));
    }
}
