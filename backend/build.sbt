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
  val sourceDir = baseDirectory.value / ".." / "frontend" / "build" / "default"
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

val buildFrontend = TaskKey[File]("build-frontend", "Build the Polymer Frontend")

buildFrontend := {
  val srcDir = baseDirectory.value / ".." / "frontend"
  val targetDir = srcDir / "build" / "default"

  println(s"Running 'npm install' in directory $srcDir")
  val npmOut = Process("npm install", Some(srcDir)).!
  if(npmOut != 0) sys.exit(npmOut)

  println(s"Running 'polymer build' in directory $srcDir")
  val polymerOut = Process("polymer build", Some(srcDir)).!

  if(polymerOut != 0) sys.exit(polymerOut)

  // There seems to be a bug in Polymer-cli preventing all dependencies to be properly copied to
  // the build directory. We were missing the google-signin buttons.
  println(s"Running 'bower install' in directory $targetDir")
  val bowerOut = Process("bower install --force", Some(targetDir)).!
  if(bowerOut != 0) sys.exit(bowerOut)

  targetDir
}
