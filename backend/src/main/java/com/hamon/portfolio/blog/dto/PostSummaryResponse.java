package com.hamon.portfolio.blog.dto;

import com.hamon.portfolio.blog.Post;
import com.hamon.portfolio.blog.Tag;
import com.hamon.portfolio.blog.TagType;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

public record PostSummaryResponse(
        Long id,
        String slug,
        String title,
        LocalDate date,
        String projectRef,
        Set<TagDto> tags) {

    public record TagDto(String name, TagType type) {
        public static TagDto from(Tag tag) {
            return new TagDto(tag.getName(), tag.getType());
        }
    }

    public static PostSummaryResponse from(Post post) {
        Set<TagDto> tagDtos = post.getTags().stream()
                .map(TagDto::from)
                .collect(Collectors.toSet());

        return new PostSummaryResponse(
                post.getId(),
                post.getSlug(),
                post.getTitle(),
                post.getDate(),
                post.getProjectRef(),
                tagDtos
        );
    }
}
