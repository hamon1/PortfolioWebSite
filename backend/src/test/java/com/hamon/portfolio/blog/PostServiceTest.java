package com.hamon.portfolio.blog;

import com.hamon.portfolio.blog.dto.PostRequest;
import com.hamon.portfolio.blog.dto.PostResponse;
import com.hamon.portfolio.common.NotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    PostRepository postRepository;

    @InjectMocks
    PostService postService;

    private Post buildPost(String id, String slug) {
        return Post.builder()
                .id(id)
                .slug(slug)
                .title("Test Title")
                .content("content")
                .date(LocalDate.of(2026, 7, 25))
                .tags(List.of(new TagItem("React", TagType.PROJECT)))
                .build();
    }

    private PostRequest buildRequest(String slug) {
        return new PostRequest(slug, "Test Title", "content",
                LocalDate.of(2026, 7, 25), null,
                List.of(new PostRequest.TagInfo("React", TagType.PROJECT)));
    }

    @Test
    @DisplayName("포스트 생성 성공")
    void create_success() {
        PostRequest request = buildRequest("hello-world");
        Post saved = buildPost("abc123", "hello-world");

        when(postRepository.existsBySlug("hello-world")).thenReturn(false);
        when(postRepository.save(any(Post.class))).thenReturn(saved);

        PostResponse result = postService.create(request);

        assertThat(result.slug()).isEqualTo("hello-world");
        assertThat(result.tags()).hasSize(1);
        verify(postRepository).save(any(Post.class));
    }

    @Test
    @DisplayName("slug 중복 시 예외 발생")
    void create_duplicateSlug_throws() {
        when(postRepository.existsBySlug("dup")).thenReturn(true);

        assertThatThrownBy(() -> postService.create(buildRequest("dup")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("dup");
    }

    @Test
    @DisplayName("slug로 포스트 조회 성공")
    void findBySlug_found() {
        Post post = buildPost("1", "test-slug");
        when(postRepository.findBySlug("test-slug")).thenReturn(Optional.of(post));

        PostResponse result = postService.findBySlug("test-slug");

        assertThat(result.slug()).isEqualTo("test-slug");
        assertThat(result.title()).isEqualTo("Test Title");
    }

    @Test
    @DisplayName("존재하지 않는 slug 조회 시 NotFoundException")
    void findBySlug_notFound_throws() {
        when(postRepository.findBySlug("none")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.findBySlug("none"))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("포스트 삭제 성공")
    void delete_success() {
        when(postRepository.existsById("1")).thenReturn(true);

        postService.delete("1");

        verify(postRepository).deleteById("1");
    }

    @Test
    @DisplayName("존재하지 않는 포스트 삭제 시 NotFoundException")
    void delete_notFound_throws() {
        when(postRepository.existsById("99")).thenReturn(false);

        assertThatThrownBy(() -> postService.delete("99"))
                .isInstanceOf(NotFoundException.class);
    }
}
