package com.hamon.portfolio.blog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("""
            SELECT DISTINCT p FROM Post p
            JOIN p.tags t
            WHERE t.name = :tagName
            """)
    Page<Post> findByTagName(@Param("tagName") String tagName, Pageable pageable);
}
