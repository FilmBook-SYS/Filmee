# Multi-stage Dockerfile for Filmee Java Backend
# Stage 1: Build Maven WAR
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Apache Tomcat 9.0 (Java EE 8 / javax.servlet compatible)
FROM tomcat:9.0-jdk17-temurin-jammy

# Clean default Tomcat webapps
RUN rm -rf /usr/local/tomcat/webapps/*

# Deploy Filmee as ROOT webapp
COPY --from=builder /app/target/*.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]
