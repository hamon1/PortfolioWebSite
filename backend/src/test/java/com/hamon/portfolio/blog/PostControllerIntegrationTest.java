package com.hamon.portfolio.blog;

import com.fasterxml.jackson.databind.ObjectMapper;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PostControllerIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    PostRepository postRepository;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        postRepository.deleteAll();
    }

    private Post savePost(String slug, String title) {
        return postRepository.save(Post.builder()
                .slug(slug)
                .title(title)
                .content("본문 내용")
                .date(LocalDate.of(2026, 7, 25))
                .tags(List.of(new TagItem("Spring", TagType.GENERAL)))
                .build());
    }

    @Test
    @DisplayName("GET /api/posts - 빈 목록 반환")
    void list_empty_returnsEmptyPage() throws Exception {
        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(0));
    }

    @Test
    @DisplayName("GET /api/posts - 데이터 있을 때 목록 반환")
    void list_withData_returnsPage() throws Exception {
        savePost("post-one", "첫 번째 포스트");
        savePost("post-two", "두 번째 포스트");

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(2));
    }

    @Test
    @DisplayName("GET /api/posts/{slug} - 존재하는 slug 조회 성공")
    void getBySlug_exists_returnsPost() throws Exception {
        savePost("my-post", "My Post Title");

        mockMvc.perform(get("/api/posts/my-post"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.slug").value("my-post"))
                .andExpect(jsonPath("$.data.title").value("My Post Title"));
    }

    @Test
    @DisplayName("GET /api/posts/{slug} - 존재하지 않는 slug 조회 시 404")
    void getBySlug_notExists_returns404() throws Exception {
        mockMvc.perform(get("/api/posts/nonexistent"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /api/posts - tag 필터링")
    void list_withTagFilter_returnsFiltered() throws Exception {
        postRepository.save(Post.builder()
                .slug("react-post")
                .title("React 포스트")
                .content("내용")
                .date(LocalDate.of(2026, 7, 25))
                .tags(List.of(new TagItem("React", TagType.PROJECT)))
                .build());
        savePost("spring-post", "Spring 포스트");

        mockMvc.perform(get("/api/posts").param("tag", "React"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalElements").value(1))
                .andExpect(jsonPath("$.data.content[0].slug").value("react-post"));
    }

    @Test
    @DisplayName("POST /api/admin/posts - 인증 없이 접근 시 401/403")
    void adminCreate_withoutJwt_returns401() throws Exception {
        PostRequest request = new PostRequest("unauthorized-post", "title",
                "content", LocalDate.now(), null, null);

        mockMvc.perform(post("/api/admin/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is(org.hamcrest.Matchers.either(
                        org.hamcrest.Matchers.is(401)).or(org.hamcrest.Matchers.is(403))));
    }
}
