import sbt.Keys._

name in ThisBuild := "misc"

scalaVersion in ThisBuild := "2.12.7"

lazy val misc = (project in file("."))
  .settings(
    crossScalaVersions := Seq("2.12.7"),
    libraryDependencies ++= Seq(
      "org.scalatest"     %% "scalatest"            % "3.0.5"           % Test
    ),
    logBuffered in Test := false,
    parallelExecution in Test := false,
    scalacOptions in ThisBuild ++= Seq("-unchecked", "-deprecation")
  )

