# ── Build stage (Gradle 8.7 + JDK 21 내장 이미지) ─────
FROM gradle:8.7-jdk21-alpine AS builder
WORKDIR /workspace

COPY . .
RUN gradle bootJar -x test --no-daemon

# ── Runtime stage (JRE만 포함, 경량) ───────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /workspace/build/libs/portfolio-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-Xmx400m", \
  "-Xss512k", \
  "-jar", "app.jar"]
