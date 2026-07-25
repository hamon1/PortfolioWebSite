package com.hamon.portfolio.blog.dto;

import com.hamon.portfolio.blog.TagType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

public record PostRequest(
        @NotBlank String slug,
        @NotBlank String title,
        String content,
        @NotNull LocalDate date,
        String projectRef,
        Set<TagInfo> tags) {

    public record TagInfo(
            @NotBlank String name,
            @NotNull TagType type) {
    }
}
