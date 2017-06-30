# Competence Center Backend

The Finch API that serves the competence center backend.

## How to run
`sbt run` will start a service on `http://localhost:9000`, use `sbt test` to test your code.

## Building with docker

Run `sbt buildFrontend docker:stage`, and you'll have a docker file ready in `target/docker/stage`... To be continued.

Go to `target/docker/stage`

Start docker on your machine. Then run: 
`docker build . -t cco`
`docker run -p 8081:8080 -it cco`

Open `http://localhost:8080`

### TODO
 - Load data DB / connect to external DB from config (done in test)
 - fix list table issue
 - fix dependencies issue JS
 - Build with Jenkins
 - Deploy on CC
 
 
 ## Deploy on Clever Cloud 
 A file named Dockerfile is required, with "CMD " (this is the command that starts your application).
 The application must listen on port 8080.
 Documentation about Docker is available!
 
 