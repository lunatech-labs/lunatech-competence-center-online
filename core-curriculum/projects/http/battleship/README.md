# Lunatech Battleship #

The goal of this learning project is that you implement the OpenAPI specification
you can find at the `swagger.yml` file present in this folder. There it defines
the endpoints you need to implement to complete the project. You can read more
about the project [here](https://docs.google.com/document/d/17Q2fqNP-PWd_ZIvmKIEJ5iTkHhZ6ha8_KZLfP31Hkg0/edit?usp=sharing).

## TBD
This project misses some Postman automated tests.

## Implementation

You can implement this project with any set of technologies or language of your
choosing (Java, Scala or Kotlin). Please follow the architecture it's defined on
the document, we know that there are other possible solutions and we would like to
hear your thoughts on it. We provide some tests you can assess the correctness of
your solution, nonetheless if you still want to try a different approach consider
this tests may not adapt it.

To follow the approach stated take the `userId` and the `fullName` from environment
variables, a properties file or command line arguments. Aside from that, only the
port number should be different.

We also provide an implementation of the Board Generator, you can just copy/paste
this into your project, or implement one on your own ;)

We don't want consider all possibilities in this project, so we'll leave out of
consideration things such as concurrency, persistence or security. We'll consider
these things on further projects.

## Java

For a Java implementation we recommend that you use a Maven Archetype like:

**Spring Boot**:
```
mvn archetype:generate \
     -DarchetypeGroupId=com.romeh.spring-boot-archetypes \
     -DarchetypeArtifactId=spring-boot-quickstart \
     -DarchetypeVersion=1.0.0 \
     -DgroupId=com.lunatech \
     -DartifactId=battleship \
     -Dversion=1.0.0-SNAPSHOT \
     -DinteractiveMode=false
```
**Javalin**:
```
mvn archetype:generate -DarchetypeGroupId=com.willwinder \
  -DarchetypeArtifactId=javalin-java-archetype \
  -DarchetypeVersion=1.0.2 \
  -DgroupId=com.lunatech \
  -DartifactId=battleship \
  -Dversion=1.0.0-SNAPSHOT \
  -DinteractiveMode=false
```
**Vert.x**:
```
mvn archetype:generate -Dfilter=io.vertx: -DgroupId=com.lunatech -DartifactId=battelship -Dversion=1.0.0-SNAPSHOT
```

## Scala

For a Scala implementation we recommend that you get one of existing [sbt templates](https://www.scala-sbt.org/1.0/docs/sbt-new-and-Templates.html) like:

- playframework/play-scala-seed.g8
- akka/akka-http-quickstart-scala.g8
- bneil/finch-skeleton.g8

For Play, Akka HTTP and Finch respectively.
