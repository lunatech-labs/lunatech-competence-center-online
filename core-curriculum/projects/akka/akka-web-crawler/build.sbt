name := "akka-web-crawler"

version := "1.0"

scalaVersion := "2.12.6"

lazy val akkaVersion = "2.5.16"

libraryDependencies ++= Seq(
  "com.typesafe.akka" %% "akka-actor"   % akkaVersion,
  "com.typesafe.akka" %% "akka-testkit" % akkaVersion,
  "org.jsoup"         % "jsoup"         % "1.11.3",
  "org.scalatest" %% "scalatest" % "3.0.5" % "test"
)
