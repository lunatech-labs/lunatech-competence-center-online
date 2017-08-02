# lunatech-competence-center-online
CCO is the Competence Center Online for Lunatech employees.

## Contact and Information
Erik Bakker is the initiator of the Competence Center and oversees all sub projects.

## Purpose
The Competence Center will become a portal in which Lunatech employees can track their development and where to improve their development via training or workshop. On the other side it gives Client directors / Sales insight into who will fit in which project based on experience and knowledge.

## Structure
- Frontend: Polymer web application. 
- Backend: Finch http service
- Fonts: helper project containing fonts for the PDF generation

The whole application is deployed as a Docker application on Clever Cloud. 

The frontend is served via NGINX, the backend application on port 9000 is linked to /api in NGINX. The database is hosted on Clever Cloud as well. 

## How to run
- The application can use a PostgreSQL db on Clever Cloud see [config](backend/src/main/resources/application.conf)
- For a local db we use Docker: 
    - The Schema will automatically be loaded by [Flyway](http://flaywaydb.org) when the application starts.  
- [Build and serve frontend](frontend/README.md)
- [Run the backend](backend/README.md)
- Open [http://localhost:8080](http://localhost:8080) in your browser

## Setup local dev environment and run locally
For convenience we've created scripts to get you started. All scripts should be started from `/scripts` directory, and all commands should be executed in separate window. 
1. Start database in Docker
 - start docker on your laptop
 - the load script is in `/backend/db/dump.sql`
 - `./build_db.sh`
 
2. Run backend locally & interactive
 - `./run_backend.sh`
  
3. Run nginx locally
 - Make sure nginx is installed on your machine
 - `./run_local_nginx.sh`
 
4. Run polymer locally & interactive
 - `./serve_frontend.sh`

//TODO update postman collection
- Use the provided [Postman](https://www.getpostman.com/) [collection](backend/resources/CCO.postman_collection.json) and [environment](backend/resources/OCC.postman_environment.json) to try the API.


## How to contribute
- Make sure you can run the application. See above
- Pick an issue from the issue list in [Github](https://github.com/lunatech-labs/lunatech-competence-center-online/issues)
- Create a feature branch, fix the issue and submit a MR



#### Developing with DB in Docker
- go to `backend/db`
- create dump from live database with
`pg_dump -h b2opnoivihzpzig-postgresql.services.clever-cloud.com -p 5432 -U ul3rd8gpvpa8p9oqjk2c -d b2opnoivihzpzig > dump.sql`
- docker build -t learndb .
- docker run -p 5432:5432 -t learndb
- Now you can access the db with `psql -h localhost -p 5432 -U ul3rd8gpvpa8p9oqjk2c`



### How to test the application. 
//TODO


## How to deploy 
The `Master` version of the application is deployed as a Docker application on Clever Cloud. 
The frontend is served via NGINX
The backend application on port 9000 is linked to /api in NGINX. 
The database is hosted on Clever Cloud as well. 

The project is still in development phase and thus all commits / merges into Master will trigger a build on [Jenkins](jenkins.lunatech.com). Eventually the production branch will be used for deployments on CC. 
The deployment consists of 2 steps:
1. A [build step](http://jenkins.lunatech.com/job/competence-center-online-build/)
2. A [deploy step](http://jenkins.lunatech.com/job/competence-center-online-deploy/) that is triggered after a succesfull build step. This deploys the Docker image on Clever Cloud. It may take a while before you can view the new version of the application online. 
3. View application at: [learn.lunatech.com](learn.lunatech.com)


## API Documentation

- [Swagger REST API documentation](backend/resources/swagger.yml)

  Copy/paste the swagger.yml content into http://editor.swagger.io/ to
  view the documentation for the REST API

## Sub projects

### CV editor and generator
The CV editor and generator can be used to create a consistent set of CV information for all Lunatechies and make it easy to generate a CV for a specific project. The 3 main functionalities are:
1. List all Lunatech developers and show if they have updated CV data
2. Edit / Create CV data for yourself
3. Generate a CV based on (a subset of) CV data
