package com.hamon.portfolio.blog.dto;

import com.hamon.portfolio.blog.Post;
import com.hamon.portfolio.blog.TagItem;
import com.hamon.portfolio.blog.TagType;

import java.time.LocalDate;
import java.util.List;

public record PostSummaryResponse(
        String id,
        String slug,
        String title,
        LocalDate date,
        String projectRef,
        List<TagDto> tags) {

    public record TagDto(String name, TagType type) {
        public static TagDto from(TagItem tag) {
            return new TagDto(tag.getName(), tag.getType());
        }
    }

    public static PostSummaryResponse from(Post post) {
        List<TagDto> tagDtos = post.getTags().stream()
                .map(TagDto::from)
                .toList();

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
