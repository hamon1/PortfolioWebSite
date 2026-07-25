package com.hamon.portfolio.blog;

import com.hamon.portfolio.blog.dto.PostRequest;
import com.hamon.portfolio.blog.dto.PostResponse;
import com.hamon.portfolio.blog.dto.PostSummaryResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final TagRepository tagRepository;

    public Page<PostSummaryResponse> findAll(String tagName, Pageable pageable) {
        Page<Post> posts = StringUtils.hasText(tagName)
                ? postRepository.findByTagName(tagName, pageable)
                : postRepository.findAll(pageable);
        return posts.map(PostSummaryResponse::from);
    }

    public PostResponse findBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Post not found: " + slug));
        return PostResponse.from(post);
    }

    @Transactional
    public PostResponse create(PostRequest request) {
        if (postRepository.existsBySlug(request.slug())) {
            throw new IllegalArgumentException("Slug already exists: " + request.slug());
        }

        Set<Tag> tags = resolveTags(request);
        Post post = Post.builder()
                .slug(request.slug())
                .title(request.title())
                .content(request.content())
                .date(request.date())
                .projectRef(request.projectRef())
                .tags(tags)
                .build();

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public PostResponse update(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found: " + id));

        Set<Tag> tags = resolveTags(request);
        post.update(request.title(), request.content(), request.date(),
                request.projectRef(), tags);

        return PostResponse.from(post);
    }

    @Transactional
    public void delete(Long id) {
        if (!postRepository.existsById(id)) {
            throw new EntityNotFoundException("Post not found: " + id);
        }
        postRepository.deleteById(id);
    }

    private Set<Tag> resolveTags(PostRequest request) {
        if (request.tags() == null || request.tags().isEmpty()) {
            return new HashSet<>();
        }

        Set<Tag> resolved = new HashSet<>();
        for (PostRequest.TagInfo info : request.tags()) {
            Tag tag = tagRepository.findByName(info.name())
                    .orElseGet(() -> tagRepository.save(
                            Tag.builder()
                                    .name(info.name())
                                    .type(info.type())
                                    .build()
                    ));
            resolved.add(tag);
        }
        return resolved;
    }
}
