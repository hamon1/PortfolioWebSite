package com.hamon.portfolio.blog;

import com.hamon.portfolio.blog.dto.PostRequest;
import com.hamon.portfolio.blog.dto.PostResponse;
import com.hamon.portfolio.blog.dto.PostSummaryResponse;
import com.hamon.portfolio.common.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    public Page<PostSummaryResponse> findAll(String tagName, Pageable pageable) {
        Page<Post> posts = StringUtils.hasText(tagName)
                ? postRepository.findByTagsName(tagName, pageable)
                : postRepository.findAll(pageable);
        return posts.map(PostSummaryResponse::from);
    }

    public PostResponse findBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Post not found: " + slug));
        return PostResponse.from(post);
    }

    public PostResponse create(PostRequest request) {
        if (postRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Slug already exists: " + request.slug());
        }

        Post post = Post.builder()
                .slug(request.slug())
                .title(request.title())
                .content(request.content())
                .date(request.date())
                .projectRef(request.projectRef())
                .tags(toTagItems(request))
                .build();

        return PostResponse.from(postRepository.save(post));
    }

    public PostResponse update(String id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Post not found: " + id));
        post.update(request.title(), request.content(), request.date(),
                request.projectRef(), toTagItems(request));
        return PostResponse.from(postRepository.save(post));
    }

    public void delete(String id) {
        if (!postRepository.existsById(id)) {
            throw new NotFoundException("Post not found: " + id);
        }
        postRepository.deleteById(id);
    }

    private List<TagItem> toTagItems(PostRequest request) {
        if (request.tags() == null) return List.of();
        return request.tags().stream()
                .map(t -> new TagItem(t.name(), t.type()))
                .toList();
    }
}
