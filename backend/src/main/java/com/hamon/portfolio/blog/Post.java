package com.hamon.portfolio.blog;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String title;

    private String content;

    private LocalDate date;

    private String projectRef;

    @Builder.Default
    private List<TagItem> tags = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void update(String title, String content, LocalDate date,
                       String projectRef, List<TagItem> tags) {
        this.title = title;
        this.content = content;
        this.date = date;
        this.projectRef = projectRef;
        this.tags = tags;
    }
}
