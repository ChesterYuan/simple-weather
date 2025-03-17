# Simple Weather App

A containerized weather application that provides real-time weather data and forecasts using the Open-Meteo API.

## Features

- Real-time weather data for any location
- 7-day weather forecast
- Hourly weather forecast
- Search for locations by city name
- View weather for major cities around the world
- Recent search history (stores last 5 searches)
- Responsive design for desktop and mobile

## Technologies Used

- **Frontend**: React, Material-UI, Chart.js
- **Backend**: Node.js, Express
- **API**: Open-Meteo (free, no API key required)
- **Containerization**: Docker

## Running with Docker

### Prerequisites

- Docker and Docker Compose installed on your machine

### Building and Running the Container

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/simple-weather.git
   cd simple-weather
   ```

2. Build and start the container:
   ```bash
   docker-compose up --build
   ```

3. Access the application at http://localhost:3000

### Docker Commands

- Build the Docker image:
  ```bash
  docker build -t simple-weather .
  ```

- Run the container:
  ```bash
  docker run -p 3000:3000 simple-weather
  ```

- Stop the container:
  ```bash
  docker-compose down
  ```

## Development Setup (without Docker)

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd src/frontend
   npm install
   ```

### Running in Development Mode

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. In another terminal, start the frontend development server:
   ```bash
   cd src/frontend
   npm start
   ```

3. Access the frontend at http://localhost:3001 and the backend at http://localhost:3000

## Project Structure

```
simple-weather/
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
├── package.json          # Backend dependencies and scripts
├── src/
│   ├── api/              # Backend code
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── services/     # External API communication
│   │   └── server.js     # Express server setup
│   └── frontend/         # React frontend
│       ├── public/       # Static assets
│       ├── src/          # React source code
│       │   ├── components/ # UI components
│       │   ├── services/   # API communication
│       │   └── utils/      # Utility functions
│       └── package.json  # Frontend dependencies and scripts
└── public/              # Built frontend (production)
```

## License

MIT