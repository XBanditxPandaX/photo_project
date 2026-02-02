# Step 1: Use an official OpenJDK base image from Docker Hub
FROM --platform=linux/amd64 eclipse-temurin:17

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the Spring Boot JAR file into the container
COPY target/photo-gallery-1.0.0.jar /app/my-spring-boot-app.jar


ENV DATABASE_URL="postgresql://ep-restless-salad-ags4urkz-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
ENV PGUSER="neondb_owner"
ENV PGPASSWORD="npg_h7kpDx5AVWzY"

# Step 4: Expose the port your application runs on
EXPOSE 8080

# Step 5: Define the command to run your Spring Boot application
CMD ["java", "-jar", "/app/my-spring-boot-app.jar"]