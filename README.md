# SyncPlayer

SyncPlayer is a synchronized media player application with a three-tier architecture (React frontend, Java Spring Boot backend, and PostgreSQL database).

## Project Structure

```
syncplayer/
├── frontend/         # React.js application
├── backend/          # Java Spring Boot application
└── database/         # PostgreSQL and Flyway migrations
```

## Prerequisites

- Java JDK 17+
- Node.js 16+
- Docker and Docker Compose
- Gradle

## Getting Started

> **Note:** The frontend is configured to proxy API requests to the backend server running on port 8080. Make sure the backend is running before starting the frontend.

### Database Setup

1. Navigate to the database directory:
   ```
   cd database
   ```

2. Start PostgreSQL and run Flyway migrations:
   ```
   docker-compose up -d
   ```

3. If you encounter migration issues (checksum mismatches), you can reset the database:
   ```
   ./clean-db.sh
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Build the application:
   ```
   ./gradlew build
   ```

3. Run the application:
   ```
   ./gradlew bootRun
   ```

   The backend will be available at http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

   The frontend will be available at http://localhost:3000

## Running Tests

### Backend Tests

```
cd backend
./gradlew test
```

### Frontend Tests

```
cd frontend
npm test
```

## API Documentation

- GET `/api/hello` - Returns a test message from the database

## Technology Stack

- **Frontend**: React.js
- **Backend**: Java Spring Boot, Gradle, JUnit 5
- **Database**: PostgreSQL with Flyway migrations

## Development

This project follows a monorepo approach with clear separation between frontend, backend, and database components.