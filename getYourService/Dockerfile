FROM ubuntu:latest
LABEL authors="sripa"

ENTRYPOINT ["top", "-b"]



FROM openjdk:17-jdk-alpine
ADD target/getYourService-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]