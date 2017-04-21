scalaVersion := "2.12.1"

libraryDependencies ++= Seq(
  "com.github.finagle" %% "finch-core" % "0.14.0",
  "com.github.finagle" %% "finch-circe" % "0.14.0",

  "io.circe" %% "circe-generic" % "0.7.0",
  "io.circe" %% "circe-parser" % "0.7.0",

  "com.google.http-client" % "google-http-client-jackson" % "1.22.0",
  "com.google.api-client" % "google-api-client" % "1.22.0",

  "org.tpolecat" %% "doobie-core-cats" % "0.4.1",
  "org.postgresql" % "postgresql" % "42.0.0")
