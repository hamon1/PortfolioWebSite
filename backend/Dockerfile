# ── Build stage ────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace

COPY . .
RUN chmod +x gradlew && ./gradlew bootJar -x test --no-daemon

# ── Runtime stage ───────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /workspace/build/libs/portfolio-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-Xmx400m", \
  "-Xss512k", \
  "-jar", "app.jar"]
