# Competence Center Backend

The Finch API that serves the competence center backend.

## How to run
`sbt run` will start a service on `http://localhost:9000`, use `sbt test` to test your code.

## Building with docker

Run `sbt buildFrontend docker:stage`, and you'll have a docker file ready in `target/docker/stage`... To be continued.

Go to `target/docker/stage`

Start docker on your machine. Then run: 
`docker build -t cco . `
`docker run -p 8080:8080 -ti cco`

Open `http://localhost:8080`



## Useful Docker commands
 - Clean up system: `docker system prune`
 - Get access to shell inside container: `docker exec -i -t cco /bin/bash`


### TODO
 - Load data DB / connect to external DB from config (done in test)
 - Logging in API
 - Logging in Docker
 - Cross Origin within Docker / proxy nginx
 - fix list table issue
 - fix dependencies issue JS NOT FOUND / Access Denied
 - Build with Jenkins
 - Deploy on CC
 
 
 ## Deploy on Clever Cloud 
 A file named Dockerfile is required, with "CMD " (this is the command that starts your application).
 The application must listen on port 8080.
 Documentation about Docker is available!
 
 
 # Running database using docker image
 - The following command will run the db and adminer docker images
 `docker-compose -f db-stack.yml up` - [more options](https://docs.docker.com/compose/reference/up/)
 - Postgres will listen to the port 5432 and adminer will listen to the port 8088
 - Database username: `postgres` and password: `secret`
 - rename the file [src/main/resources/environment-specific-template.conf](src/main/resources/environment-specific-template.conf) to `environment-specific.conf` for the local development
 
