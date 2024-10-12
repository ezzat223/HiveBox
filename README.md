# HiveBox API

This is a RESTful API for the HiveBox project built using Node.js and Express.

## Endpoints

### 1. `/version`
- **GET**: Returns the version of the app.
  - Response:
    ```json
    {
      "version": "v0.0.1"
    }
    ```

### 2. `/temperature`
- **GET**: Returns the average temperature from all senseBox data for the last hour.
  - Response:
    ```json
    {
      "averageTemperature": 24.5
    }
    ```

## Running Locally
To run the app locally:

1. Build the Docker image:
   ```bash
   docker build -t hivebox-app .
