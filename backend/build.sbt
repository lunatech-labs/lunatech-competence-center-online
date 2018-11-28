import com.typesafe.sbt.packager.docker._

scalaVersion := "2.12.3"

organization := "com.lunatech.cc"

name := "cco-backend"

lazy val catsVersion = "0.9.0"
lazy val circeVersion = "0.8.0"
lazy val finchVersion = "0.15.1"
lazy val googleHttpVersion = "1.22.0"
lazy val logbackVersion = "1.2.3"

libraryDependencies ++= Seq(
  "com.github.finagle" %% "finch-core" % finchVersion,
  "com.github.finagle" %% "finch-circe" % finchVersion,

  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-optics" % circeVersion,

  "org.typelevel" %% "cats" % catsVersion,

  "com.github.pureconfig" %% "pureconfig" % "0.7.0",

  "com.google.http-client" % "google-http-client-jackson" % googleHttpVersion,
  "com.google.api-client" % "google-api-client" % googleHttpVersion,

  "org.tpolecat" %% "doobie-core-cats" % "0.4.1",
  "org.postgresql" % "postgresql" % "42.1.3",
  "org.flywaydb" % "flyway-core" % "4.2.0",

  "org.apache.xmlgraphics" % "fop" % "2.2",
  "org.apache.xmlgraphics" % "batik-constants" % "1.9",
  "org.apache.xmlgraphics" % "batik-i18n" % "1.9",

  "org.scala-lang.modules" %% "scala-xml" % "1.0.6",
  "org.scala-lang.modules" %% "scala-parser-combinators" % "1.0.6",
  "net.databinder.dispatch" %% "dispatch-core" % "0.13.1",

  "org.slf4j" % "jul-to-slf4j" % "1.7.25",
  "ch.qos.logback" % "logback-classic" % logbackVersion,

  "org.scalatest" %% "scalatest" % "3.0.3" % "test",
  "com.typesafe" % "config" % "1.3.1"
)

lazy val root = (project in file(".")).
  enablePlugins(ScalaxbPlugin).
  settings(
    scalaxbDispatchVersion in (Compile, scalaxb) := "0.11.3",
    scalaxbPackageName in (Compile, scalaxb)     := "xml",
    flywayUrl := "jdbc:postgresql:competence-center",
    flywayUser := "postgres",
    scalacOptions += "-Ywarn-unused-import"
  )

coverageExcludedPackages := "scalaxb;xml;"

enablePlugins(JavaAppPackaging)
enablePlugins(AshScriptPlugin)

maintainer := "Erik Bakker <erik.bakker@lunatech.com>"
packageSummary := "Competence Center Online"
packageDescription := "Competence Center main application"

dockerBaseImage := "openjdk:jre-alpine"
dockerCommands := {
  val from :: remainder = dockerCommands.value
  from ::
    Cmd("RUN", "apk update") ::
    Cmd("RUN", "apk add nginx supervisor") ::
    Cmd("RUN", "mkdir -p /run/nginx") :: // See https://github.com/gliderlabs/docker-alpine/issues/185
    Cmd("ADD", "nginx.conf", "/etc/nginx/nginx.conf") ::
    Cmd("ADD", "supervisord.conf", "/etc/supervisor/conf.d/supervisord.conf") ::
    remainder
}
daemonUser in Docker := "root"
dockerEntrypoint := Seq("/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf")
dockerExposedPorts := Seq(8080)

mappings in Docker ++= Seq(
  baseDirectory.value / "nginx.conf" -> "nginx.conf",
  baseDirectory.value / "supervisord.conf" -> "supervisord.conf")

// Add frontend files to Docker
mappings in Docker ++= {
  val sourceDir = baseDirectory.value / ".." / "elm-frontend" / "dist"
  ((sourceDir.*** --- sourceDir) pair relativeTo(sourceDir)).map { case (file, mapping) =>
    file -> ("opt/docker/frontend/" + mapping)
  }
}

// Add core curriculum to Docker
mappings in Docker ++= {
  val sourceDir = baseDirectory.value / ".." / "core-curriculum"
  ((sourceDir.*** --- sourceDir) pair relativeTo(sourceDir)).map { case (file, mapping) =>
    file -> ("opt/docker/core-curriculum/" + mapping)
  }
}

// Add pages to Docker
mappings in Docker ++= {
  val sourceDir = baseDirectory.value / ".." / "pages"
  ((sourceDir.*** --- sourceDir) pair relativeTo(sourceDir)).map { case (file, mapping) =>
    file -> ("opt/docker/pages/" + mapping)
  }
}

val buildFrontend = TaskKey[File]("build-frontend", "Build the Elm Frontend")

buildFrontend := {
  val srcDir = baseDirectory.value / ".." / "elm-frontend"
  val targetDir = srcDir / "dist"

  println(s"Running 'parcel build index.html' in directory $srcDir")
  val parcelOut = Process("parcel build index.html", Some(srcDir)).!
  if(parcelOut != 0) sys.exit(parcelOut)

  targetDir
}

addCommandAlias("lint", "all compile:scalafix test:scalafix")
