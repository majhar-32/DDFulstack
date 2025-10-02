# Stage 1: Build Environment (JDK + Maven)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# কপি pom.xml এবং src কোড
COPY pom.xml .
COPY src /app/src

# প্রজেক্ট বিল্ড করা এবং টেস্ট বাদ দেওয়া
RUN mvn -DskipTests clean package

# Stage 2: Runtime Environment (JRE Only)
# FIX: JRE image updated to a verified, smaller alternative (Temurin JRE on Alpine)
FROM eclipse-temurin:21-jre-alpine
EXPOSE 8080

# ফাইল আপলোডের জন্য ভলিউম পথ নির্ধারণ (docker-compose-এর সাথে সামঞ্জস্যপূর্ণ)
VOLUME /app/uploads

# Build স্টেজ থেকে তৈরি হওয়া JAR ফাইলটি কপি করা
ARG JAR_FILE=/app/target/ddbackend-demo.jar
COPY --from=build $JAR_FILE /ddbackend-demo.jar

# কন্টেইনার চালু করার জন্য এন্ট্রি পয়েন্ট
ENTRYPOINT ["java", "-jar", "/ddbackend-demo.jar"]