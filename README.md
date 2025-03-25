# SyncPlayer

SyncPlayer is a synchronized media player application with a three-tier architecture (React frontend, Java Spring Boot backend, and PostgreSQL database).

## Project Structure

```
syncplayer2/
├── frontend/         # React.js application
├── backend/          # Java Spring Boot application
├── database/         # PostgreSQL and Flyway migrations
└── cleanup.sh        # Repository cleanup utility
```

## Prerequisites

- Java JDK 17+
- Node.js 16+
- Docker and Docker Compose
- Gradle

## Getting Started

> **Note:** The frontend is configured to proxy API requests to the backend server running on port 8080. Make sure the backend is running before starting the frontend.

### Initial Setup

For a clean start, run the following commands in the specified order:

1. **Database Setup**
2. **Backend Setup** 
3. **Frontend Setup**

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

- **Frontend**: React.js with Axios for API calls
- **Backend**: Java Spring Boot, Gradle, JUnit 5, JPA/Hibernate
- **Database**: PostgreSQL with Flyway migrations

## Repository Maintenance

### Cleaning the Repository

If you encounter issues with untracked files or need to reset your workspace:

```
./cleanup.sh
```

This script will:
- Remove all untracked files and directories
- Reset any modified files to their committed state
- Provide instructions for restarting development

### Git Workflow

1. Create a feature branch:
   ```
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```
   git add .
   git commit -m "Your descriptive commit message"
   ```

3. Push changes to the remote repository:
   ```
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request using GitHub interface or the GitHub CLI:
   ```
   gh pr create --title "Your PR Title" --body "Description of changes"
   ```

## Development

This project follows a monorepo approach with clear separation between frontend, backend, and database components.

All communication between frontend and backend happens via RESTful API calls. The frontend is configured to proxy requests to the backend server.