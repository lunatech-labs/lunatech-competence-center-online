Full dev env docker compose.
===

Sets up a running local instance of the competence center.

## Structure:
The setup consists of 5 containers and makes extensive use of volumes to directly mount the source code into the containers. 
This allows the use of live reloading (backend) and linking of own polymer components (frontend) to maintain the original development workflow.

Container    | Port mapping | Description
-------------|--------------|--------------------------------------------------------
postgresql   | n/a          | Basic postgresql image.
adminer      | 8088:8080    | Basic adminer image.
backend      | n/a          | Backend image based on containerized sbt, runs `sbt "~re-start"` in `backend`
frontend     | n/a          | Frontend image based on custom image with polymer-cli and bower installed, in this image the user running polymer has the same UID as the user on the host mac, to prevent permissions issues with the bind mount. Links the local components and runs `polymer serve` in `frontend`.
proxy        | 8080:8080    | Glues frontend/backend services together and exposes them.

Note that to use this compose your environment-specific.conf must be updated to connect to "postgresql:5432" instead of "localhost:5432". 

## Prerequisites:
* docker
* docker-compose
* nginx (if you run docker-machine).

## Running it
Move to `scripts/cc_fullstack` and run `./start_stack.sh`. The first time will take a while as the SBT container has to fetch dependencies and the frontend container will have to be built.
On subsequent runs, the containers will be reused by docker compose.

if you run docker-machine the `start_stack.sh` will detect this and automatically spawn an nginx running that allows you to access the competence center on 'localhost'. This is because the dev mode of the application assumes it runs on local host and not on the `$localip` of your docker machine.

If you want to clear your old environment and start fresh run `docker-compose rm` and bring the stack up again using `docker-compose up`.
