# ===== Build Stage =====
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy file pom trước
COPY pom.xml .

# Download dependency trước (cache được)
RUN mvn dependency:go-offline -B

# Sau đó mới copy source
COPY src ./src

# Build
RUN mvn clean package -DskipTests

# ===== Run Stage =====
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]