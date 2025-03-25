#!/bin/bash

echo "Stopping containers..."
docker-compose down

echo "Removing database volume..."
docker volume rm syncplayer2_postgres-data || true

echo "Starting fresh database and running migrations..."
docker-compose up -d