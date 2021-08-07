Contributing
===

## Directory structure

- `/frontend`: Polymer web application.
- `/backend`: Finch http service
- `/fonts`: Helper project containing fonts for the PDF generation of the CV's project.
  `/core-curriculum`: Content of the Core Curriculum project.
  `/scripts`: Useful scripts for development.

## Running locally
There now is a docker-compose available in `scipts/cc_fullstack` that brings up a complete dev environment using docker compose.
See the [readme](scripts/cc_fullstack/) in that directory for the details, if you prefer the old way, then carry on in this document.

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

Use `scalafix RemoveUnusedImports` for cleaning up imports


### Frontend

    scripts/link_local_polymer_components.sh

    cd frontend
    npm install
    polymer serve

In case of conflicts, remove the bower_components and redo steps described above.

### nginx

    scripts/run_local_nginx.sh


### Observe

Browse to http://localhost:8080/ to see the application.
There is also a GUI running on top of the Postgres database, reach it on http://localhost:8088/ and login with username `postgres`, password `secret` and database `competence-center`.

## How To's

### How to impersonate another user

This application uses user roles as defined in Lunatech's People API. Depending on the role, pages and API endpoints may or may not be accessible. Sometimes, your own roles aren't sufficient to see the pages.

You can impersonate another user by using the 'fake' token verifier, and configuring it with an override-email. See the `application.conf` for the details.

When you use this; don't be confused that in the frontend you might still see your own name and photo. This is because the Google id token that the frontend obtains is still yours, and that's what it uses to print name and photo. But the `lunatechProfile` that the frontend obtains, which contains the roles, will contain the overridden user profile.


## API Documentation

- WIP [Swagger REST API documentation](backend/resources/swagger.yml)

  Copy/paste the swagger.yml content into http://editor.swagger.io/ to
  view the documentation for the REST API
