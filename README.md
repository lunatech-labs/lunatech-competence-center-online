# lunatech-competence-center-online
CCO is the Competence Center Online for Lunatech employees.

## Contact and Information
Erik Bakker is the initiator of the Competence Center and oversees all sub projects.

## Purpose
The Competence Center will become a portal in which Lunatech employees can track their development and where to improve their development via training or workshop. On the other side it gives Client directors / Sales insight into who will fit in which project based on experience and knowledge.

## Structure
- Frontend: Polymer web application
- Backend: Finch http service
- Fonts: helper project containing fonts for the PDF generation

## How to run
- Configure a PostgreSQL server in `backend/src/main/resources/application.conf`
  - Install PostgreSQL via `brew install postgres`
  - `/usr/local/Cellar/postgresql/<INSERT YOUR POSTGRES VERSION NUMBER (e.g., 9.6.2)>/bin/createuser -s postgres`
  - `createdb -O postgres competence-center` (if this returns `createdb: could not connect to database`, try `brew services stop postgresql; brew services start postgresql`)
  - The Schema will automatically be loaded by [Flyway](http://flaywaydb.org) when the application starts.
- [Build and serve frontend](frontend/README.md)
- [Run the backend](backend/README.md)
- Open [http://localhost:8081](http://localhost:8081) in your browser
- Use the provided [Postman](https://www.getpostman.com/) [collection](backend/resources/CCO.postman_collection.json) and [environment](backend/resources/OCC.postman_environment.json) to try the API.


## Documentation

- [Swagger REST API documentation](backend/resources/swagger.yml)

  Copy/paste the swagger.yml content into http://editor.swagger.io/ to
  view the documentation for the REST API

## Sub projects

### CV editor and generator
The CV editor and generator can be used to create a consistent set of CV information for all Lunatechies and make it easy to generate a CV for a specific project. The 3 main functionalities are:
1. List all Lunatech developers and show if they have updated CV data
2. Edit / Create CV data for yourself
3. Generate a CV based on (a subset of) CV data
