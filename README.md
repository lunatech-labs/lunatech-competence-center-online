# lunatech-competence-center-online
CCO is the Competence Center Online for Lunatech employees.

## Purpose
TODO

## Structure
- Frontend: Polymer web application
- Backend: Finagle http service

## How to run
- Configure a PostgreSQL server with the provided [schema](backend/src/main/resources/schema.sql)
- [Build and serve frontend](frontend/README.md)
- [Run the backend](backend/README.md)
- Open [http://localhost:8081](http://localhost:8081) in your browser
- Use the provided [Postman](https://www.getpostman.com/) [collection](backend/resources/CCO.postman_collection.json) and [environment](backend/resources/OCC.postman_environment.json) to try the API.
