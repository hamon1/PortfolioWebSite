package com.hamon.portfolio.blog.dto;

import com.hamon.portfolio.blog.Post;
import com.hamon.portfolio.blog.TagItem;
import com.hamon.portfolio.blog.TagType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
        String id,
        String slug,
        String title,
        String content,
        LocalDate date,
        String projectRef,
        List<TagDto> tags,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public record TagDto(String name, TagType type) {
        public static TagDto from(TagItem tag) {
            return new TagDto(tag.getName(), tag.getType());
        }
    }

    public static PostResponse from(Post post) {
        List<TagDto> tagDtos = post.getTags().stream()
                .map(TagDto::from)
                .toList();

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
