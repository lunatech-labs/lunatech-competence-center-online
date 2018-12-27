import sbt.Keys._

name in ThisBuild := "exampledb"

scalaVersion in ThisBuild := "2.12.7"

lazy val akkaVersion = "2.5.17"

lazy val exampledb = (project in file("."))
  .settings(
    crossScalaVersions := Seq("2.12.7"),
    libraryDependencies ++= Seq(
      "com.typesafe.akka" %% "akka-actor"           % akkaVersion,
      "com.typesafe.akka" %% "akka-testkit"         % akkaVersion       % Test,
      "org.scalacheck"    %% "scalacheck"           % "1.14.0"          % Test,
      "org.scalatest"     %% "scalatest"            % "3.0.5"           % Test
    ),
    logBuffered in Test := false,
    parallelExecution in Test := false,
    scalacOptions in ThisBuild ++= Seq("-unchecked", "-deprecation")
  )

addCommandAlias("qa", "; clean; coverage; test; coverageReport")
