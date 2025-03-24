#!/bin/bash

echo "Cleaning up repository..."

# Remove all untracked files and directories
git clean -fdx

# Reset any modified files
git checkout -- .

echo "Repository cleaned up successfully. Use the following commands to continue development:"
echo "1. cd database && docker-compose up -d"
echo "2. cd backend && ./gradlew bootRun"
echo "3. cd frontend && npm install && npm start"