# FeedMe-Food-Tracking Backend 1.0 APK

## Abstract
Microservice architecture for Android food tracking app backend with RESTful service, using Java and the Java SpringBoot framework.

## Repository Aufbau

### backend/graphql-gateway
### backend/services
#### backend/services/authentication-service
#### backend/services/user-service
#### backend/services/inventory-service
#### backend/services/shoppinglist-service
#### backend/services/recepy-service
#### backend/services/product-detection-service (not in pipeline)
#### backend/services/barcode-detection-service (not in pipeline)

## Start the Application

## CI/CD

## Architecture

### GraphQL
- Query language 
- Single entrypoint

### Serverside Technology Stack
#### NodeJS + Express
- Single-threaded, low-memory utilization
- Non-blocking I/O model, useful for I/O-bound tasks
- Data-intensive applications that need to operate in real-time
- Not great for heavy computing - can lead to performance bottlenecks

#### Java + Spring Boot
- Java is statically-typed (type safety)
- Support for multi-threading
- Quick startup for production-grade app
- Minimizes required steps to get app up and running
- Relies on annotations/XML configs
- Useful for dealing with long/repetitive operations

### Database System

#### MongoDB + Mongoose