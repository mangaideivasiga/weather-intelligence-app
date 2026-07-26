# Weather Intelligence App

## Project Overview

The Weather Intelligence App is a web application generated using **Google AI Studio App Build**. It enables users to search for a city, retrieve current weather conditions, view a 7-day weather forecast, and receive simple weather-based planning recommendations.

The application uses publicly available APIs from **Open-Meteo** and does not require any API keys.

---

# Project Objectives

* Build a weather application using Google AI Studio.
* Export and organize the generated source code.
* Run the application locally.
* Dockerize the application using Docker.
* Validate that the application runs successfully inside a Docker container.
* Prepare the application for deployment.

---

# Technologies Used

* Google AI Studio App Build
* React 19
* TypeScript
* Vite
* Node.js
* NPM
* Docker
* Nginx
* GitHub
* GitHub Codespaces

---

# APIs Used

## Open-Meteo Geocoding API

Purpose:
Converts the city name entered by the user into latitude and longitude coordinates.

Endpoint:

https://geocoding-api.open-meteo.com/v1/search

---

## Open-Meteo Forecast API

Purpose:
Retrieves current weather information and the 7-day weather forecast.

Endpoint:

https://api.open-meteo.com/v1/forecast

---

# Features

* Search weather by city name
* Current weather information
* 7-day weather forecast
* Hourly weather details
* Weather-based planning recommendations
* User-friendly interface
* Error handling for invalid city names
* Responsive design

---

# Project Structure

```text
weather-intelligence-app
│
├── assets/
├── src/
│   ├── components/
│   ├── services/
│   ├── utils/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
│
├── Dockerfile
├── .dockerignore
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── metadata.json
└── README.md
```

---

# Local Development

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npm run dev
```

Open the application in the browser using the forwarded port displayed by GitHub Codespaces.

---

# Build Production Version

```bash
npm run build
```

The optimized production files are generated inside the **dist** folder.

---

# Dockerization

## Build Docker Image

```bash
docker build -t weather-app .
```

---

## Verify Docker Image

```bash
docker images
```

---

## Run Docker Container

```bash
docker run -d -p 3000:80 --name weather-container weather-app
```

---

## Verify Running Container

```bash
docker ps
```

---

## Stop Docker Container

```bash
docker stop weather-container
```

---

## Remove Docker Container

```bash
docker rm weather-container
```

---

# Testing Performed

The application was validated using the following scenarios:

### Test Case 1

City: London

Expected Result:

* Current weather displayed
* Hourly forecast displayed
* 7-day forecast displayed
* Planning recommendation generated

Status:
Passed

---

### Test Case 2

City: Chennai

Expected Result:

* Current weather displayed
* Hourly forecast displayed
* 7-day forecast displayed
* Planning recommendation generated

Status:
Passed

---

### Test Case 3

City: InvalidCity123

Expected Result:

* Appropriate error message displayed

Status:
Passed

---

# Docker Workflow

The Docker implementation follows a multi-stage build approach.

### Build Stage

* Uses Node.js 22
* Installs dependencies
* Builds the React application
* Generates the production-ready **dist** folder

### Production Stage

* Uses Nginx Alpine image
* Copies the generated dist folder
* Serves the application through Nginx
* Exposes port 80

This approach reduces the Docker image size and improves deployment efficiency.

---

# Challenges Encountered

## Issue

Application failed to start due to import resolution error.

Reason

The file name was:

```
openMeteo.TS
```

Instead of:

```
openMeteo.ts
```

GitHub Codespaces runs on Linux, where filenames are case-sensitive.

Resolution

Renamed the file to:

```
openMeteo.ts
```

The application built successfully afterward.

---

# Development Environment

This project was completed using:

* GitHub Repository
* GitHub Codespaces (Linux-based cloud development environment)
* Node.js
* NPM
* Docker Engine available within GitHub Codespaces

GitHub Codespaces was used as an equivalent Linux environment for development and Docker execution.

---

# Responsible AI

* Used only public weather information.
* No personal or customer data was used.
* No API keys or private credentials were stored in the project.
* Open-Meteo public APIs were used for all weather requests.

---

# Human Validation

The AI-generated application was manually reviewed and validated.

The following were verified:

* Project structure
* Application functionality
* API responses
* Error handling
* Docker build
* Docker container execution
* Production build output

---

# Assignment Deliverables

The submission includes:

* Source code
* Dockerfile
* .dockerignore
* README
* Dockerized application
* Evaluation Rubric
* Supporting screenshots

---

# Author

Project: Weather Intelligence App

Assignment:
AI-Assisted App Building – Level 2

Environment Used:
GitHub Codespaces

Container Technology:
Docker

Frontend:
React + Vite + TypeScript

Weather Provider:
Open-Meteo
