package com.hamon.portfolio.visitor.dto;

import java.util.Map;

public record VisitorStatsResponse(
        long total,
        long today,
        Map<String, Long> byPath) {
}
