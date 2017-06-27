import com.typesafe.sbt.packager.docker._

scalaVersion := "2.11.8"

organization := "com.lunatech.cc"

name := "cco-backend"

lazy val catsVersion = "0.9.0"
lazy val circeVersion = "0.7.0"
lazy val finchVersion = "0.14.0"
lazy val googleHttpVersion = "1.22.0"

libraryDependencies ++= Seq(
  "com.github.finagle" %% "finch-core" % finchVersion,
  "com.github.finagle" %% "finch-circe" % finchVersion,

  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,

  "org.typelevel" %% "cats" % catsVersion,

  "com.google.http-client" % "google-http-client-jackson" % googleHttpVersion,
  "com.google.api-client" % "google-api-client" % googleHttpVersion,

  "org.tpolecat" %% "doobie-core-cats" % "0.4.1",
  "org.postgresql" % "postgresql" % "42.0.0",
  "org.flywaydb" % "flyway-core" % "4.2.0",

  "org.apache.xmlgraphics" % "fop" % "2.2",
  "org.apache.xmlgraphics" % "batik-constants" % "1.9",
  "org.apache.xmlgraphics" % "batik-i18n" % "1.9",

  "org.scala-lang.modules" %% "scala-xml" % "1.0.6",
  "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.5",
  "net.databinder.dispatch" %% "dispatch-core" % "0.11.3",

  "org.scalatest" %% "scalatest" % "2.2.4" % "test",
  "com.typesafe" % "config" % "1.3.1"
)

lazy val root = (project in file(".")).
  enablePlugins(ScalaxbPlugin).
  settings(
    scalaxbDispatchVersion in (Compile, scalaxb) := "0.11.3",
    scalaxbPackageName in (Compile, scalaxb)     := "xml",
    flywayUrl := "jdbc:postgresql:competence-center",
    flywayUser := "postgres"
  )

coverageExcludedPackages := "scalaxb;xml;"

enablePlugins(JavaAppPackaging)

maintainer := "Erik Bakker <erik.bakker@lunatech.com>"
packageSummary := "Competence Center Online"
packageDescription := "Competence Center main application"

dockerBaseImage := "openjdk:latest"
dockerCommands := {
  val from :: remainder = dockerCommands.value
  from :: Cmd("RUN", "apt-get update && apt-get install -y nginx") :: remainder
}
dockerExposedPorts := Seq(8080)
