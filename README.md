# SyncPlayer

SyncPlayer is a modern application for synchronized media playback.

## Architecture

The application follows a three-tier architecture with clear separation between frontend, backend, and database layers:

- **Frontend**: React.js application that provides the user interface and communicates with the backend via REST API calls and WebSockets
- **Backend**: Java Spring Boot application that handles business logic, authentication, and database operations
- **Database**: PostgreSQL database for persistent data storage

## Tech Stack

- **Frontend**: React
- **Backend**: Java (Spring Boot, Gradle, Cucumber, JUnit 5)
- **Database**: PostgreSQL (Flyway for migrations)

## Project Structure

The project follows a monorepo approach with the following structure:

```
/
├── backend/             # Java Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── build.gradle
├── frontend/            # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   └── package.json
└── docker-compose.yml   # Docker setup for local development
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- Docker and Docker Compose

### Setup

1. Start the database:

```bash
docker-compose up -d
```

2. Run the backend:

```bash
cd backend
./gradlew bootRun
```

3. Run the frontend:

```bash
cd frontend
npm install
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Backend

The backend API endpoints are available at:

- GET `/api/messages` - Get all messages
- POST `/api/messages` - Create a new message

### Frontend

The frontend includes a simple interface for adding and displaying test messages.

## Testing

### Backend Tests

```bash
cd backend
./gradlew test
```

### Frontend Tests

```bash
cd frontend
npm test
```