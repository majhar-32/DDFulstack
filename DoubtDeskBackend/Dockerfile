# Stage 1: Build Environment (JDK + Maven)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# কপি pom.xml এবং dependency resolve করা
COPY pom.xml .
RUN mvn dependency:go-offline -B

# এখন সম্পূর্ণ source কোড কপি করা
COPY src /app/src

# প্রজেক্ট build করা (test skip করে)
RUN mvn clean package -DskipTests

# Stage 2: Runtime Environment (JRE Only)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
EXPOSE 8080

# Build স্টেজ থেকে তৈরি হওয়া JAR ফাইল কপি করা
COPY --from=build /app/target/ddbackend-demo.jar app.jar

# অ্যাপ চালু করা
ENTRYPOINT ["java", "-jar", "app.jar"]
