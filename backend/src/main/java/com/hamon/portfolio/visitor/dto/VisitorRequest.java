package com.hamon.portfolio.visitor.dto;

import com.hamon.portfolio.visitor.VisitPath;
import jakarta.validation.constraints.NotNull;

public record VisitorRequest(@NotNull VisitPath path) {
}
