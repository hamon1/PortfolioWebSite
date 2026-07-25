package com.hamon.portfolio.blog.dto;

import com.hamon.portfolio.blog.Post;
import com.hamon.portfolio.blog.Tag;
import com.hamon.portfolio.blog.TagType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

public record PostResponse(
        Long id,
        String slug,
        String title,
        String content,
        LocalDate date,
        String projectRef,
        Set<TagDto> tags,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public record TagDto(String name, TagType type) {
        public static TagDto from(Tag tag) {
            return new TagDto(tag.getName(), tag.getType());
        }
    }

    public static PostResponse from(Post post) {
        Set<TagDto> tagDtos = post.getTags().stream()
                .map(TagDto::from)
                .collect(Collectors.toSet());

        return new PostResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getContent(),
                post.getDate(),
                post.getProjectRef(),
                tagDtos,
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
