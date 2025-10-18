# Node.js CRUD API with MongoDB, Jest, Docker, and GitHub Actions

## Features
- Express.js REST API
- MongoDB with Mongoose (supports MongoDB Atlas)
- Jest unit tests with mock models
- Dockerized app for easy containerized development
- GitHub Actions for CI

## Scripts

```bash
npm start            # Start server locally
npm test             # Run unit tests locally

docker build -t node-crud-api .           # Build Docker image
docker run -p 5000:5000 --env-file .env node-crud-api   # Run container with .env variables

docker compose up --build                  # Build and start containers (if using docker-compose)
docker compose down                        # Stop containers
