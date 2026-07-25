package com.hamon.portfolio.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PostRepository extends MongoRepository<Post, String> {

    Optional<Post> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Page<Post> findByTagsName(String tagsName, Pageable pageable);
}
