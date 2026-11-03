# Multi-stage Dockerfile for UrbanFix Spring Boot 3.4 Backend (Java 21)

# Stage 1: Build JAR using Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production Runtime
FROM eclipse-temurin:21-jre-alpine

LABEL maintainer="UrbanFix AI Team"
LABEL description="UrbanFix AI Spring Boot Backend Microservice"

# Create unprivileged application user
RUN addgroup -S urbanfix && adduser -S urbanfix -G urbanfix

WORKDIR /app

# Copy executable jar from builder stage
COPY --from=builder /app/target/backend-1.0.0.jar app.jar

# Set permissions
RUN chown -R urbanfix:urbanfix /app

USER urbanfix:urbanfix

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -Duser.timezone=UTC"

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
