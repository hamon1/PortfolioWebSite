package com.hamon.portfolio.visitor;

import com.hamon.portfolio.common.ApiResponse;
import com.hamon.portfolio.visitor.dto.VisitorRequest;
import com.hamon.portfolio.visitor.dto.VisitorStatsResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
public class VisitorController {

    private final VisitorService visitorService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> record(
            @Valid @RequestBody VisitorRequest request,
            HttpServletRequest httpRequest) {
        String ip = resolveIp(httpRequest);
        visitorService.record(ip, request.path());
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<VisitorStatsResponse>> stats() {
        VisitorStatsResponse response = visitorService.getStats();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private String resolveIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(xRealIp)) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }
}
