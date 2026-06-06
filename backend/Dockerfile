# ─── Stage 1: Build ───────────────────────────────────────────────────
FROM maven:3.9.16-eclipse-temurin-25 AS builder

WORKDIR /app

# Copy dependency descriptors first — Docker caches this layer
# and skips re-downloading dependencies if pom.xml didn't change
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Now copy source and build — this layer only re-runs when source changes
COPY src ./src
RUN mvn package -DskipTests -q

# ─── Stage 2: Runtime ─────────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine AS runtime

WORKDIR /app

# Copy only the built jar from the builder stage
# Nothing else (source, Maven, dependencies) makes it into this image
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]