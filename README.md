# SyncPlayer2

A synchronized video playback application that allows multiple users to watch videos together in real-time.

## Project Structure

This project follows a monorepo approach with the following components:

- `frontend/` - React.js application
- `backend/` - Spring Boot application
- `database/` - PostgreSQL database with Flyway migrations

## Tech Stack

- Frontend: React.js
- Backend: Java Spring Boot
- Database: PostgreSQL
- Build Tools: Gradle
- Testing: JUnit 5, Cucumber
- Database Migrations: Flyway

## Prerequisites

- Java 17 or later
- Node.js 18 or later
- Docker and Docker Compose
- PostgreSQL 15 or later

## Getting Started

1. Clone the repository
2. Start the database:
   ```bash
   cd database
   docker-compose up -d
   ```
3. Start the backend:
   ```bash
   cd backend
   ./gradlew bootRun
   ```
4. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Development

- Frontend runs on http://localhost:3000
- Backend runs on http://localhost:8080
- Database runs on localhost:5432

## Testing

- Backend tests: `cd backend && ./gradlew test`
- Frontend tests: `cd frontend && npm test`

## License

MIT 