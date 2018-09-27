# Lunatech Battleship #
The goal of this learning project is that you implement the Lunatech Battleship
game logic with Akka. The HTTP layer has been already laid down for you. The Swagger
spec for the HTTP layer is located inside the project [/v1/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
(You have to run the project first with `sbt run`).
There it defines the endpoints you need to implement to complete the project.
You can read more about the HTTP project [here](https://docs.google.com/document/d/17Q2fqNP-PWd_ZIvmKIEJ5iTkHhZ6ha8_KZLfP31Hkg0/edit?usp=sharing).

## Implementation
You can implement this project with either Scala or Java, since it support both languages.

The HTTP layer has two routes `ProtocolRoutes` and `UserRoutes`, both of them delegate
the business logic to an actor named `gameServiceActor`, which you must implement. This
actor is instantiated in the `LunatechBattleshipServer` object  and is the only place you'll
have to touch the current project (the routes uses this instance through trait composition).
We're instantiating a `DummyGameActor` now, you must replace it with yours. Notice that you
should probably provide the same arguments (`userId` and `fullName`).

The HTTP layer communicates with the Business layer through messages defined in the package
`com.lunatech.dto`, here you will find Request and Response classes for every endpoint. This
actor should reply with an `Either[LError, ???]` where `???` is the appropiate response type
(you can read which response type you need on the corresponding Akka Route).

All you have to do is implement this `GameServiceActor` which reacts to these requests, and
then replies with these responses. Notice that you'll get the requests wrapped in
a `BattleshipHttpRequest`, this is used to attach the Game ID to the request body (ie. DTO)
and to differentiate between User Requests and Protocol Requests.

The most important thing in your implementation must be how to define the concurrency
granularity level, try to think how to support transactions with actor, since a game
acts like a state machine.

## Running the project
You can actually run multiple instances of this project to test that is working properly,
you only need to define the value of the following environment variables to avoid TCP
Bind Exceptions.

- `BHOSTNAME` (Optional): This is hostname other instance will use to reach the server .
- `BPORT` (Required): This is the port where the HTTP server will bind itself.
- `USER_ID` (Required): The user id you want this instance to belong to.
- `USER_NAME` (Optional): This is the user full name, if empty will use the same value as User Id.

The `BHOSTNAME` is optional if you're running all instances locally.

To run two instance you can simply do on one terminal session:

```
BPORT=8080 USER_ID=foo USER_NAME="Mr. Foo" sbt run
```

And then on another session:

```
BPORT=8081 USER_ID=bar USER_NAME="Mr. Bar" sbt run
```

## Tests
We've provided you with tests for the HTTP layer, this will help you know if you're in a good track. The layer replies
with either a DTO or with an `LError` (eg. `GameNotFound` or `NotPlayersTurn`), which is a way of identifying the correct
HTTP status code to return based on the Spec.

Feel free to add your own tests to check how the business logic is performing.

## Troubleshooting
If you have any doubts, you can talk to anyone on the Interview Panel.

If you have ideas on how to improve this project, please let us know, we're happy to improve it.