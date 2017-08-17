Contributing
===

## Directory structure

- `/frontend`: Polymer web application.
- `/backend`: Finch http service
- `/fonts`: Helper project containing fonts for the PDF generation of the CV's project.
  `/core-curriculum`: Content of the Core Curriculum project.
  `/scripts`: Useful scripts for development.

## Running locally

Prepare yourself, it's not as smooth as some other applications. We'll make it better in the future.

To fully run the application, you need to configure your environment and run 4 things (in 4 terminals):

* The Postgres database
* The backend
* The frontend
* Nginx

### Prerequisites

You need to have the following things installed:

* Docker
* nginx

### Configuring your environment

This application depends on the [Lunatech People API](https://github.com/lunatech-labs/lunatech-people-api) and on the [EventBrite](http://eventbrite.com) API. This being a public repo, we can't add credentials for those API's here. Instead, you need to use a Secure Channel (tm) to obtain them; which consists of contacting Erik Bakker.

Once you have API keys for EventBrite and the People API, do the following:

* Copy `backend/src/main/resources/environment-specific-template.conf` to `backend/src/main/resources/environment-specific.conf` and put in that file the API keys.

### Postgres database

    scripts/run_db.sh

### Backend

    cd backend
    sbt "~re-start"

### Frontend

    cd frontend
    npm install
    polymer serve

### nginx

    scripts/run_local_nginx.sh

- [Build and serve frontend](frontend/README.md)
- [Run the backend](backend/README.md)
- Open [http://localhost:8081](http://localhost:8081) in your browser
- Use the provided [Postman](https://www.getpostman.com/) [collection](backend/resources/CCO.postman_collection.json) and [environment](backend/resources/OCC.postman_environment.json) to try the API.

## Documentation

- [Swagger REST API documentation](backend/resources/swagger.yml)

  Copy/paste the swagger.yml content into http://editor.swagger.io/ to
  view the documentation for the REST API
