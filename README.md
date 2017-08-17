# Lunatech Competence Center Online

This is Lunatech's internal learning center. It's a hosted application, running on https://learn.lunatech.com/.

## Projects

The competence center contains multiple projects:

* Developer Passport editor & CV generator
* Workshops Catalogue
* Core Curriculum
* Tech Matrix (external project)

## Technical

The application consists of a backend written in Scala with Finch, and a frontend Polymer application. They are tied together using nginx, which reverse proxies the backend under the `/api` path, and hosts the frontend on the `/` path.

For local development, the setup is slightly different: `polymer serve` serves the frontend, and nginx reverse proxies that as well.

On production, the whole application (backend, frontend, nginx), are deployed as a single Docker container, which is built using `sbt-native-packager`.

## Running the code

See `CONTRIBUTING.md` for instructions.

## Contact and Information

[Erik Bakker](mailto:erik.bakker@lunatech.com) is the owner of this application.
