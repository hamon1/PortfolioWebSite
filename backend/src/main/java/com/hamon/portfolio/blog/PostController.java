package com.hamon.portfolio.blog;

import com.hamon.portfolio.blog.dto.PostResponse;
import com.hamon.portfolio.blog.dto.PostSummaryResponse;
import com.hamon.portfolio.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PostSummaryResponse>>> list(
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("date").descending());
        Page<PostSummaryResponse> result = postService.findAll(tag, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<PostResponse>> getBySlug(@PathVariable String slug) {
        PostResponse response = postService.findBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
